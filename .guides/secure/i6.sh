#!/bin/bash

echo "<h3>Double your money</h3>"
POINTS=0

cd /interact/i6
javac DoubleInvestment.java
# Check for compile error
if [ $? -ne 0 ]; then exit 1; fi


# test case 1 : 100
OUTPUT1=("$(echo 100 | java DoubleInvestment)")
if [ $? -ne 0 ]; then exit 1; fi
echo "$OUTPUT1"
exit 0
if [ *"$OUTPUT1"* != "Year: 13"]; then 
  echo "<br/><hr/><h3>Test 1</h3>"
  echo "Annual contribution: 100"
  exit 1
fi


# test case 2 : 500
OUTPUT2=("$(java DoubleInvestment 500)")
if [ $? -ne 0 ]; then exit 1; fi
echo "$OUTPUT2"


# check for the expected behavior
if [ "$OUTPUT1" != "Hello World 3" ]; then 
  echo "<br/><hr/><h3>Challenge Feedback</h3>"
  echo "Your code is not outputing the correct value"
  exit 1
fi


echo "<br/><hr/><h3>Your Score</h3>"
echo "You got " + POINTS + "points."
exit 0

curl -s "$CODIO_PARTIAL_POINTS_URL&points=${POINTS}" > /dev/null