#!/usr/bin/env python

import sys
import subprocess
import os
from subprocess import Popen, PIPE, STDOUT

os.chdir('/home/codio/workspace/interact/i6/')

def start_test(cont, years, balance):
  try:
    p = Popen(['java', 'DoubleInvestment6'], stdout=PIPE, stdin=PIPE, stderr=PIPE)
    p.stdin.write(cont + '\n')
    output = p.communicate()[0]
    p.stdin.close()
  except subprocess.CalledProcessError as e:
    print(e.output)
    sys.exit(1)
  
  if ("Year: " + years not in output) or  ("Balance: " + balance not in output):
    print("This test failed. We passed in a contribution of <b>" + cont + "</b>. The results should have been <ul><li>Years: " + years + "</li><li>Balance: " + balance)
    sys.exit(1)
    
def compile_test():
  print("Compiling your code, please wait ...<br>")
  try:
    output = subprocess.check_output("javac DoubleInvestment6.java", shell=True)
  except subprocess.CalledProcessError as e:
    print("<h3>Compile Error</h3>")
    print("<pre>" + e.output + "</pre>")
    exit(1)
    
def run_test():
  print("<h3>Double your money</h3>")
  compile_test()
  start_test("100", "13", "20527")
  start_test("500", "9", "20526")
  print("<b>All tests passed! Well done.</b>")
  sys.exit(0)
  end_test
  
run_test()