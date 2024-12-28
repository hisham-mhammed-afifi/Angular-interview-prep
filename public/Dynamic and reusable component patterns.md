Dynamic and reusable component patterns in Angular are critical for building scalable, maintainable, and DRY (Don’t Repeat Yourself) applications. Let’s explore advanced techniques and patterns for creating dynamic and reusable components.

---

## **1. Dynamic Components**

Dynamic components are components that are created, configured, and inserted at runtime.

### **Use Cases**

- Modals or dialogs.
- Dynamic forms.
- Dashboards with configurable widgets.
- Context-sensitive components (e.g., tooltips or popovers).

### **Implementation**

#### **a. Dynamic Component Loader**

Angular provides the `ViewContainerRef` and `ComponentFactoryResolver` (deprecated as of Angular 13; use `ComponentFactory` and Ivy APIs instead).

```typescript
import { Component, ComponentRef, ViewChild, ViewContainerRef } from "@angular/core";

@Component({
  selector: "app-dynamic-host",
  template: `<ng-template #container></ng-template>`,
})
export class DynamicHostComponent {
  @ViewChild("container", { read: ViewContainerRef }) container!: ViewContainerRef;
  private componentRef!: ComponentRef<any>;

  loadComponent(component: any): void {
    this.container.clear(); // Clear existing components
    this.componentRef = this.container.createComponent(component);
  }

  setInputs(inputs: Record<string, any>): void {
    if (this.componentRef) {
      Object.assign(this.componentRef.instance, inputs);
    }
  }
}
```

#### **b. Example: Dynamic Modal Component**

##### 1. Modal Component

```typescript
@Component({
  selector: "app-modal",
  template: `
    <div class="modal">
      <h2>{{ title }}</h2>
      <p>{{ content }}</p>
      <button (click)="close()">Close</button>
    </div>
  `,
})
export class ModalComponent {
  title!: string;
  content!: string;
  close = () => {};
}
```

##### 2. Using the Dynamic Host

```typescript
@Component({
  selector: "app-root",
  template: `<button (click)="openModal()">Open Modal</button><app-dynamic-host></app-dynamic-host>`,
})
export class AppComponent {
  @ViewChild(DynamicHostComponent) dynamicHost!: DynamicHostComponent;

  openModal(): void {
    this.dynamicHost.loadComponent(ModalComponent);
    this.dynamicHost.setInputs({
      title: "Dynamic Modal",
      content: "This is a dynamically loaded modal!",
      close: () => this.dynamicHost.container.clear(),
    });
  }
}
```

### **Key Points**

- **Pros**:
  - Decoupled and reusable.
  - Flexible at runtime.
- **Cons**:
  - Slightly more complex.
  - Testing can be tricky.

---

## **2. Reusable Component Patterns**

Reusable components encapsulate functionality and design for repeated use across the application.

### **a. Content Projection**

- Content projection allows you to pass HTML content or child components into a reusable component using `<ng-content>`.

#### **Example: Card Component**

```typescript
@Component({
  selector: "app-card",
  template: `
    <div class="card">
      <div class="card-header">
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class CardComponent {}
```

##### **Usage**

```html
<app-card>
  <div header>My Card Title</div>
  <p>This is the card body content.</p>
</app-card>
```

---

### **b. Structural Directives**

Use structural directives like `*ngIf` and `*ngFor` for dynamic and reusable rendering.

#### **Example: Table Component**

```typescript
@Component({
  selector: "app-table",
  template: `
    <table>
      <thead>
        <tr>
          <th *ngFor="let header of headers">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of data">
          <td *ngFor="let key of keys">{{ row[key] }}</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class TableComponent {
  @Input() headers: string[] = [];
  @Input() data: any[] = [];
  get keys(): string[] {
    return this.data.length ? Object.keys(this.data[0]) : [];
  }
}
```

##### **Usage**

```html
<app-table
  [headers]="['Name', 'Age', 'Occupation']"
  [data]="[
    { name: 'Alice', age: 30, occupation: 'Engineer' },
    { name: 'Bob', age: 25, occupation: 'Designer' }
  ]"
>
</app-table>
```

---

### **c. Reusable Form Components**

#### **Example: Input Field with Validation**

```typescript
@Component({
  selector: "app-input",
  template: `
    <label [for]="id">{{ label }}</label>
    <input [id]="id" [type]="type" [formControl]="control" />
    <div *ngIf="control.invalid && control.touched">
      <small *ngIf="control.hasError('required')">This field is required</small>
      <small *ngIf="control.hasError('minlength')"> Minimum length is {{ control.getError("minlength").requiredLength }} </small>
    </div>
  `,
})
export class InputComponent {
  @Input() id!: string;
  @Input() label!: string;
  @Input() type: string = "text";
  @Input() control!: FormControl;
}
```

##### **Usage**

```html
<form [formGroup]="form">
  <app-input id="username" label="Username" [control]="form.get('username')"> </app-input>
</form>
```

```typescript
@Component({
  template: ` form = this.fb.group({ username: ['', [Validators.required, Validators.minLength(3)]], }); `,
})
export class SomeComponent {
  constructor(private fb: FormBuilder) {}
}
```

---

### **3. Higher-Order Components**

Reusable components that **wrap child components** to add additional functionality.

#### **Example: Loading Spinner**

```typescript
@Component({
  selector: "app-loading",
  template: `
    <ng-container *ngIf="loading; else content">
      <p>Loading...</p>
    </ng-container>
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class LoadingComponent {
  @Input() loading: boolean = false;
}
```

##### **Usage**

```html
<app-loading [loading]="isLoading">
  <p>Content goes here</p>
</app-loading>
```

---

### **4. Configurable Components with Dynamic Inputs**

Allow dynamic configuration via `@Input()`.

#### **Example: Button Component**

```typescript
@Component({
  selector: "app-button",
  template: `
    <button [ngClass]="classes" [disabled]="disabled">
      {{ label }}
    </button>
  `,
})
export class ButtonComponent {
  @Input() label: string = "Click Me";
  @Input() classes: string = "btn-primary";
  @Input() disabled: boolean = false;
}
```

##### **Usage**

```html
<app-button label="Submit" classes="btn-success" [disabled]="isSubmitting"></app-button>
```

---

### **5. Design Systems and Component Libraries**

Combine reusable components into a **design system** for consistency.

#### Tools:

- **Storybook**: Develop and showcase reusable components in isolation.
- **Angular Material** or **PrimeNG**: Use pre-built component libraries.

---

### **Best Practices for Reusability**

1. **Encapsulation**:
   - Use `ViewEncapsulation` to prevent styles from leaking.
2. **Input Validation**:
   - Validate or sanitize `@Input()` values.
3. **Minimal Dependencies**:
   - Avoid coupling components to specific services.
4. **Abstract Services**:
   - Use services to share state or logic, rather than embedding it in components.
5. **Testing**:
   - Write unit tests for reusable components.

---

### **Summary**

Dynamic and reusable components make Angular applications scalable and maintainable. By leveraging techniques like **dynamic loading**, **content projection**, **configurable inputs**, and **reusable patterns**, you can create components that are versatile, modular, and easy to maintain.
