You now know how to declare and update the variables in Java. What you don’t yet know is how to carry out the steps `while the balance is less than $20,000`.

In Java, the while statement implements such a repetition (see Syntax 4.1). It has the form

```java
while (condition)
{
   statements
}
```

|||definition
**Definition**
A loop executes instructions repeatedly while a condition is true.
|||

As long as the condition remains true, the statements inside the while statement are executed. These statements are called the body of the while statement.

![](.guides/img/bjol_04_un03_2.png)

In a particle accelerator, subatomic particles traverse a loop-shaped tunnel multiple times, gaining the speed required for physical experiments. Similarly, in computer science, statements in a loop are executed while a condition is true.

|||definition
**Syntax**
![](.guides/img/bjol_syn_04_01e_2.png)
|||

In our case, we want to increment the year counter and add interest while the balance is less than the target balance of $20,000:

```java
while (balance < TARGET)
{
   year++;
   double interest = balance * RATE / 100;
   balance = balance + interest;
}
```








