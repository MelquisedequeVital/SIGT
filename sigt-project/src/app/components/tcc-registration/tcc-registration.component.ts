import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TccStore } from '../../store/tcc-store';
import { TCC } from '../../model/tcc-model';

@Component({
  selector: 'app-tcc-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tcc-registration.component.html',
  styleUrls: ['./tcc-registration.component.css'],
})
export class TccRegistrationComponent {
  form: FormGroup;

  success = signal<boolean>(false);

  readonly loading;
  readonly error;

  readonly minDate: string;

  constructor(private fb: FormBuilder, private store: TccStore) {
    this.loading = this.store.loading$;
    this.error = this.store.error$;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];

    this.form = this.fb.group({
      studentName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/), // sanitização com  Regex
        ],
      ],
      studentId: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{5,11}$'),
        ],
      ],
      advisorName: ['', Validators.required],
      title: ['', Validators.required],
      summary: [''],
      modality: ['presencial'],
      scheduledDate: [''],
      scheduledTime: [''],
      location: [''],
      committee: [''],
    });

    effect(() => {
      if (this.store.error$() || this.success()) {
        setTimeout(() => {
          this.store.clearError();
          this.success.set(false);
        }, 4000);
      }
    });
  }

  
  onNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(
      /[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g,
      ''
    );

    input.value = sanitizedValue;
    this.form
      .get('studentName')
      ?.setValue(sanitizedValue, { emitEvent: false });
  }

  private isFutureDate(d?: string): boolean {
    if (!d) return true;
    const selected = new Date(d);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    return selected > today;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (value.scheduledDate && !this.isFutureDate(value.scheduledDate)) {
      this.form.get('scheduledDate')?.setErrors({ notFuture: true });
      this.form.markAllAsTouched();
      return;
    }

    const payload: TCC = {
      studentName: value.studentName!.trim(),
      studentId: value.studentId!,
      advisorName: value.advisorName!,
      title: value.title!,
      summary: value.summary || undefined,
      status: 'cadastrada',
      modality: value.modality,
      scheduledDate: value.scheduledDate || undefined,
      scheduledTime: value.scheduledTime || undefined,
      location: value.location || undefined,
      committee: value.committee
        ? value.committee.split(',').map((s: string) => s.trim())
        : [],
    };

    this.store.addTcc(payload);

    this.success.set(true);

    this.form.reset({ modality: 'presencial' });
  }
}

