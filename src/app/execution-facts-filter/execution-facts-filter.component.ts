import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Injectable,
  OnDestroy,
  OnInit,
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
import { add, compareAsc, differenceInDays } from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import {
  ExecutionFactFilter,
  ExecutionFactLoadParameters,
} from '../../shared/execution-facts-types';
import { ExecutionFactsLoadParametersShareService } from '../services/execution-facts-load-settings-share.service';

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl, OnDestroy {
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
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
  templateUrl: './execution-facts-filter.component.html',
  styleUrl: './execution-facts-filter.component.scss',
})
export class ExecutionFactsFilterComponent implements OnInit, OnDestroy {
  private static readonly DEFAULT_FROM_DATE =
    ExecutionFactsFilterComponent.initDefaultFromDate();
  private static readonly DEFAULT_TO_DATE =
    ExecutionFactsFilterComponent.initDefaultToDate();
  private static readonly DEFAULT_LOAD_PARAMETERS = {
    from: ExecutionFactsFilterComponent.DEFAULT_FROM_DATE,
    to: ExecutionFactsFilterComponent.DEFAULT_TO_DATE,
  };
  protected static readonly DEFAULT_PAGE_SIZE = 7;

  private static initDefaultFromDate(): Date {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 7);
    return currentDate;
  }
  private static initDefaultToDate(): Date {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate());
    return currentDate;
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

  @Output() private filterChanged = new EventEmitter<ExecutionFactFilter[]>();
  @Output() private stateFilterChanged =
    new EventEmitter<ExecutionFactFilter>();
  @Output() private pageChanged = new EventEmitter<PageEvent>();

  activeFilters: ExecutionFactFilter[] = [];
  activeStateFilter: ExecutionFactFilter = () => true;
  activeLoadSettings: ExecutionFactLoadParameters =
    ExecutionFactsFilterComponent.DEFAULT_LOAD_PARAMETERS;
  _pageSize = ExecutionFactsFilterComponent.DEFAULT_PAGE_SIZE;

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

  ngOnInit(): void {
    this.pageChanged.emit({
      length: 0,
      pageIndex: 0,
      pageSize: this._pageSize,
    });
    this.factsLoadSettingsService.nextLoadParameters(this.activeLoadSettings);
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
        this.senderFromDate.getRawValue() ??
        ExecutionFactsFilterComponent.DEFAULT_FROM_DATE,
      to:
        this.senderToDate.getRawValue() ??
        ExecutionFactsFilterComponent.DEFAULT_TO_DATE,
    };
  }

  emitLoadSettings() {
    this.factsLoadSettingsService.nextLoadParameters(this.activeLoadSettings);
  }

  clearLoadSettings() {
    this.activeLoadSettings =
      ExecutionFactsFilterComponent.DEFAULT_LOAD_PARAMETERS;
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
    this._pageSize = page.pageSize;
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
    const toDate = add(fromDate, { days: this._pageSize });
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

  get pageSize() {
    return this._pageSize;
  }

  get maxLength() {
    return Number.MAX_SAFE_INTEGER;
  }

  loadSettingsHaveChanged() {
    return (
      compareAsc(
        this.activeLoadSettings.from,
        ExecutionFactsFilterComponent.DEFAULT_FROM_DATE
      ) !== 0 ||
      compareAsc(
        this.activeLoadSettings.to,
        ExecutionFactsFilterComponent.DEFAULT_TO_DATE
      ) !== 0
    );
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
