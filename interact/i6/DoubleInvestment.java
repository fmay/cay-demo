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
