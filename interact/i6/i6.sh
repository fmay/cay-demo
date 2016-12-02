#!/bin/bash
cd ~/workspace/interact/i6
if [ $1 == "c" ]; then
  javac DoubleInvestment6.java
fi
if [ $1 == "r" ]; then
  java DoubleInvestment6
fi