You can compile and run your code at any time. Once you are happy with the code, press the Check It button below the challenge details.


{Compile}(interact/i6/i6.sh c)   

{Run|terminal}(interact/i6/i6.sh r)


{Check It!|assessment}(test-3791532714)

|||guidance
### Teacher Solution
```java
import java.util.Scanner;

/**
   This program computes the time required to double an investment
   with an annual contribution.
*/
public class DoubleInvestment6
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
