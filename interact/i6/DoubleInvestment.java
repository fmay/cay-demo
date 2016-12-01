import java.util.Scanner;

/**
   This program computes the time required to double an investment.
*/
public class Investment
{
   public static void main(String[] args)
   {  
      
      double balance = 0;
      int year = . . .;

      Scanner in = new Scanner(System.in);
      System.out.print("Target: ");
      double target = in.nextDouble();

      // Add $100 in year 1, $200 in year 2, ..., until the 
      // target has been reached

      while (. . .)
      {  
         year++;
         . . .
         balance = balance + amount;
      }
      
      System.out.println("Year: " + year);
      System.out.println("Balance: " + balance);
   }
}