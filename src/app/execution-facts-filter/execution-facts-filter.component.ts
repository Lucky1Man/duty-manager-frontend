import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { add, differenceInDays, isSameDay, subDays } from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import {
  ExecutionFactFilter,
  ExecutionFactLoadParameters,
} from '../../shared/execution-facts-types';
import { ExecutionFactsLoadParametersShareService } from '../services/execution-facts-load-settings-share.service';

@Injectable()
export class ExecutionFactPaginator implements MatPaginatorIntl, OnDestroy {
  private subscriptions: Subscription[] = [];
  activeLoadSettings?: ExecutionFactLoadParameters;
  changes: Subject<void> = new Subject<void>();
  itemsPerPageLabel = 'Days per page';
  nextPageLabel = 'Next period';
  previousPageLabel = 'Previous period';
  firstPageLabel = '';
  lastPageLabel = '';
  constructor(
    private datePipe: DatePipe,
    factsLoadSettingsService: ExecutionFactsLoadParametersShareService
  ) {
    this.subscriptions.push(
      factsLoadSettingsService.onLoadParameters((settings) => {
        this.activeLoadSettings = settings;
        this.changes.next();
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  getRangeLabel(page: number, pageSize: number, length: number) {
    return `${this.datePipe.transform(
      this.activeLoadSettings?.from,
      'MMMM d'
    )} - ${this.datePipe.transform(this.activeLoadSettings?.to, 'MMMM d')}`;
  }
}

@Component({
  selector: 'execution-facts-filter',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    MatDividerModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: ExecutionFactPaginator }],
  templateUrl: './execution-facts-filter.component.html',
  styleUrl: './execution-facts-filter.component.scss',
})
export class ExecutionFactsFilterComponent implements OnDestroy {
  private static readonly DEFAULT_PAGE_SIZE: number = 7;
  private static readonly DEFAULT_FROM_DATE =
    ExecutionFactsFilterComponent.initDefaultFromDate();
  private static readonly DEFAULT_TO_DATE = new Date();
  private static readonly DEFAULT_LOAD_PARAMETERS = {
    from: ExecutionFactsFilterComponent.DEFAULT_FROM_DATE,
    to: ExecutionFactsFilterComponent.DEFAULT_TO_DATE,
  };

  private static initDefaultFromDate(): Date {
    return subDays(new Date(), ExecutionFactsFilterComponent.DEFAULT_PAGE_SIZE);
  }

  private subscriptions: Subscription[] = [];

  senderTemplateName = new FormControl<string>('');
  senderFromDate = new FormControl<Date>(
    ExecutionFactsFilterComponent.DEFAULT_FROM_DATE,
    [Validators.required]
  );
  senderToDate = new FormControl<Date>(
    ExecutionFactsFilterComponent.DEFAULT_TO_DATE
  );
  stateFilter = { active: true, finished: true };
  pageOptions = [1, 3, 7, 31];
  private _loadSettingsChanged = false;
  activeFilters: ExecutionFactFilter[] = [];
  activeStateFilter: ExecutionFactFilter = () => true;

  @Input() pageSize = ExecutionFactsFilterComponent.DEFAULT_PAGE_SIZE;
  @Input() defaultLoadParameters: ExecutionFactLoadParameters =
    ExecutionFactsFilterComponent.DEFAULT_LOAD_PARAMETERS;
  @Output() private filterChanged = new EventEmitter<ExecutionFactFilter[]>();
  @Output() private stateFilterChanged =
    new EventEmitter<ExecutionFactFilter>();

  _activeLoadSettings: ExecutionFactLoadParameters = this.defaultLoadParameters;

  constructor(
    private factsLoadSettingsService: ExecutionFactsLoadParametersShareService
  ) {
    this.subscriptions.push(
      this.factsLoadSettingsService.onLoadParameters((settings) => {
        this.senderFromDate.setValue(settings.from);
        this.senderToDate.setValue(settings.to);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  updateFilters() {
    this.activeFilters = new Array<ExecutionFactFilter>();
    const templateName = this.senderTemplateName.getRawValue();
    if (templateName) {
      this.activeFilters.push((fact) => {
        return fact.templateName == templateName;
      });
    }
  }

  emitFilters() {
    this.filterChanged.emit(this.activeFilters);
  }

  clearFilters() {
    this.activeFilters = [];
  }

  updateLoadSetting() {
    this.activeLoadSettings = {
      from:
        this.senderFromDate.getRawValue() ?? this.defaultLoadParameters.from,
      to: this.senderToDate.getRawValue() ?? this.defaultLoadParameters.to,
    };
  }

  emitLoadSettings() {
    this.factsLoadSettingsService.nextLoadParameters(this.activeLoadSettings);
  }

  clearLoadSettings() {
    this.activeLoadSettings = this.defaultLoadParameters;
  }

  changeSelectedLoadState(event: MatButtonToggleChange) {
    let activeOption = event.value as string[];

    if (activeOption.includes('active') && activeOption.includes('finished')) {
      this.activeStateFilter = () => true;
      this.stateFilter.active = true;
      this.stateFilter.finished = true;
    } else if (activeOption.includes('finished')) {
      this.activeStateFilter = (fact) => fact.finishTime !== null;
      this.stateFilter.active = false;
      this.stateFilter.finished = true;
    } else if (activeOption.includes('active')) {
      this.activeStateFilter = (fact) => fact.finishTime === null;
      this.stateFilter.active = true;
      this.stateFilter.finished = false;
    } else {
      this.activeStateFilter = () => false;
      this.stateFilter.active = false;
      this.stateFilter.finished = false;
    }

    this.stateFilterChanged.emit(this.activeStateFilter);
  }

  changePage(page: PageEvent) {
    this.pageSize = page.pageSize;
    const pageOffset = this.getDaysOffset(page);
    let fromDate = this.activeLoadSettings.from;
    if (
      !(
        page.previousPageIndex &&
        Math.abs(page.pageIndex - page.previousPageIndex) !== 1
      )
    ) {
      fromDate = add(fromDate, { days: pageOffset });
    }
    const toDate = add(fromDate, { days: this.pageSize });
    this.activeLoadSettings = {
      from: fromDate,
      to: toDate,
    };
    this.factsLoadSettingsService.nextLoadParameters(this.activeLoadSettings);
  }

  getDaysOffset(page: PageEvent): number {
    if (!page.previousPageIndex || page.pageIndex > page.previousPageIndex) {
      return page.pageSize;
    } else {
      return 0 - page.pageSize;
    }
  }

  get maxLength() {
    return Number.MAX_SAFE_INTEGER;
  }

  get loadSettingsChanged() {
    return this._loadSettingsChanged;
  }

  get activeLoadSettings() {
    return this._activeLoadSettings;
  }

  set activeLoadSettings(settings: ExecutionFactLoadParameters) {
    this._activeLoadSettings = settings;
    if (
      isSameDay(settings.from, this.defaultLoadParameters.from) &&
      isSameDay(settings.to, this.defaultLoadParameters.to)
    ) {
      this._loadSettingsChanged = false;
    } else {
      this._loadSettingsChanged = true;
    }
  }

  calculateCurrentIndex(): number {
    const daysOffset = differenceInDays(
      new Date(),
      this.activeLoadSettings.from
    );
    const offsetRelatedToMaxValueAllowed =
      Number.MAX_SAFE_INTEGER - 1 * this.pageSize - daysOffset; // (1 * this.pageSize) is here to allow user make at least one request with 'from' date being in the future
    const paginatedOffset = offsetRelatedToMaxValueAllowed / this.pageSize;
    return paginatedOffset;
  }
}
