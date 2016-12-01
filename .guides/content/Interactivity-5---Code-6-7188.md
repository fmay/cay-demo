You can compile and run your code at any time by pressing the Run button below. Once you are done, press the Check It button below the challenge details.

{Compile and run}(interact/i6/i6i6.sh)

{Check It!|assessment}(test-3791532714)

|||guidance
### Teacher Solution
```java
import java.util.Scanner;

/**
   This program computes the time required to double an investment
   with an annual contribution.
*/
public class DoubleInvestment
{
   public static void main(String[] args)
   {  
      final double RATE = 5;
      final double INITIAL_BALANCE = 10000;
      final double TARGET = 2 * INITIAL_BALANCE;
      
      Scanner in = new Scanner(System.in);
      System.out.print("Annual contribution: ");
      double contribution = in.nextDouble();

      double balance = INITIAL_BALANCE;
      int year = 0;
     
      // TODO: Add annual contribution, but not in year 0
      while (balance < TARGET) {
        balance += balance*RATE/100;
        balance += contribution;
        year++;
      }
     balance -= contribution;
     
      System.out.println("Year: " + year);
      System.out.println("Balance: " + balance);
     
   }
}
```
