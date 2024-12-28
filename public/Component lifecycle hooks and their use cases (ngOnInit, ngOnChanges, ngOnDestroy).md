Angular component lifecycle hooks provide a way to tap into the lifecycle events of a component or directive as Angular creates, updates, or destroys them. Here's a detailed explanation of the most commonly used hooks—`ngOnInit`, `ngOnChanges`, and `ngOnDestroy`—with **use cases**.

---

## **1. `ngOnInit`**

- **Purpose**: Called **once**, after Angular initializes the component’s input properties and sets up the component. It’s a good place for initialization logic.
- **When It Runs**:
  - After the constructor.
  - After the first `ngOnChanges`, if any.

### **Use Cases**

1. **Fetch initial data**: Load data from a service or API.
2. **Set up local variables or state**: Prepare any data the component needs for its template.
3. **Subscribe to observables**: Start data streams or event listeners.

### **Example**

#### Fetching data when the component initializes:

```typescript
import { Component, OnInit } from "@angular/core";
import { DataService } from "./data.service";

@Component({
  selector: "app-user-list",
  template: `<ul>
    <li *ngFor="let user of users">{{ user.name }}</li>
  </ul>`,
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }
}
```

---

## **2. `ngOnChanges`**

- **Purpose**: Called **whenever an input property changes** (before `ngOnInit` if the component has input bindings). This hook receives a `SimpleChanges` object that contains the current and previous values of the changed inputs.
- **When It Runs**:
  - Whenever an `@Input` property changes.
  - Even if the value remains the same, Angular may trigger it (depends on value reference).

### **Use Cases**

1. **React to input changes**: Update component data or perform side effects when an input changes.
2. **Validate new data**: Ensure the new value meets specific criteria before updating the UI.
3. **Trigger additional logic**: Call functions or services based on changes.

### **Example**

#### Responding to changes in an `@Input` property:

```typescript
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";

@Component({
  selector: "app-profile",
  template: `<p>Current username: {{ username }}</p>`,
})
export class ProfileComponent implements OnChanges {
  @Input() username!: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["username"]) {
      console.log("Username changed:", changes["username"].currentValue);
    }
  }
}
```

---

## **3. `ngOnDestroy`**

- **Purpose**: Called just **before Angular destroys the component**. Use it to clean up resources like subscriptions, event listeners, or intervals.
- **When It Runs**:
  - When the component is removed from the DOM (e.g., navigating away, using `*ngIf` to hide it).

### **Use Cases**

1. **Unsubscribe from observables**: Avoid memory leaks by unsubscribing from active subscriptions.
2. **Remove event listeners**: Detach any event listeners added manually.
3. **Clean up timers or intervals**: Stop any running intervals or timeouts.

### **Example**

#### Cleaning up a subscription:

```typescript
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { DataService } from "./data.service";

@Component({
  selector: "app-live-feed",
  template: `<p>Live updates: {{ data }}</p>`,
})
export class LiveFeedComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  data: string = "";

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.subscription = this.dataService.getLiveData().subscribe((update) => {
      this.data = update;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Prevent memory leaks
    console.log("Component destroyed");
  }
}
```

---

### **Key Differences**

| Hook              | Trigger                        | Typical Use Cases                                                      |
| ----------------- | ------------------------------ | ---------------------------------------------------------------------- |
| **`ngOnInit`**    | After component initialization | Fetching initial data, subscribing to observables, initializing state. |
| **`ngOnChanges`** | When input properties change   | Reacting to `@Input()` changes, validating or transforming new data.   |
| **`ngOnDestroy`** | Before component destruction   | Cleaning up subscriptions, removing listeners, stopping timers.        |

---

### **Practical Scenario: Combining Hooks**

Imagine a **chat component** that:

1. Loads chat history (`ngOnInit`).
2. Updates the display when a new user is selected (`ngOnChanges`).
3. Cleans up WebSocket subscriptions when the component is destroyed (`ngOnDestroy`).

#### Example:

```typescript
import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { ChatService } from "./chat.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-chat",
  template: `
    <h3>Chat with {{ username }}</h3>
    <ul>
      <li *ngFor="let message of messages">{{ message }}</li>
    </ul>
  `,
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {
  @Input() username!: string;
  messages: string[] = [];
  private chatSubscription!: Subscription;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.subscribeToChat();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["username"]) {
      this.subscribeToChat();
    }
  }

  ngOnDestroy(): void {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }

  private subscribeToChat(): void {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe(); // Unsubscribe from the previous user
    }
    this.chatSubscription = this.chatService.getMessages(this.username).subscribe((message) => {
      this.messages.push(message);
    });
  }
}
```

---

### **Summary**

- **`ngOnInit`**: Ideal for initialization (fetching data, subscribing).
- **`ngOnChanges`**: React to dynamic changes in inputs.
- **`ngOnDestroy`**: Clean up resources to prevent memory leaks.
  By understanding the lifecycle hooks and their use cases, you can manage component behavior efficiently and maintain application stability.
