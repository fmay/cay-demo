When you declare a variable inside the loop body, the variable is created for each iteration of the loop and removed after the end of each iteration. For example, consider the interest variable in this loop:

```java
while (balance < TARGET)
{
   year++;
   double interest = balance * RATE / 100;  
   balance = balance + interest;
} // interest no longer declared here
```

In contrast, the balance and year variables were declared outside the loop body. That way, the same variable is used for all iterations of the loop.

On the left is the real code solution. You can step through this code yourself using the integrated debugger. We would normally provide instructions here but this is only a demo for Cay.