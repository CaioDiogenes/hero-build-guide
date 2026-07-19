import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

const MAX_SUGGESTIONS = 8;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tag-list-input',
  imports: [FormsModule],
  templateUrl: './tag-list-input.html',
  styleUrl: './tag-list-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagListInput),
      multi: true,
    },
  ],
})
export class TagListInput implements ControlValueAccessor {
  // Known values to suggest while typing (e.g. every gem name already used
  // across heroes). Optional — fields with no fixed vocabulary omit this.
  // Typing something that matches no suggestion is still accepted as freeform.
  readonly options = input<string[]>([]);

  readonly values = signal<string[]>([]);
  readonly draft = signal('');
  readonly disabled = signal(false);
  readonly focused = signal(false);

  readonly filteredOptions = computed(() => {
    const available = this.options().filter((option) => !this.values().includes(option));
    const query = this.draft().trim().toLowerCase();

    const matches = query
      ? available.filter((option) => option.toLowerCase().includes(query))
      : available;

    return matches.slice(0, MAX_SUGGESTIONS);
  });

  readonly showSuggestions = computed(
    () => this.focused() && this.options().length > 0 && this.filteredOptions().length > 0,
  );

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string[] | null): void {
    this.values.set(value ?? []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  addFromDraft(): void {
    this.addValue(this.draft());
  }

  selectOption(option: string): void {
    this.addValue(option);
  }

  remove(index: number): void {
    this.values.update((values) => values.filter((_, valueIndex) => valueIndex !== index));
    this.emitChange();
  }

  private addValue(value: string): void {
    const trimmed = value.trim();

    if (!trimmed || this.values().includes(trimmed)) {
      this.draft.set('');
      return;
    }

    this.values.update((values) => [...values, trimmed]);
    this.draft.set('');
    this.emitChange();
  }

  private emitChange(): void {
    this.onTouched();
    this.onChange(this.values());
  }
}
