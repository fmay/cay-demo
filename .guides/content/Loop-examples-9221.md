The following table shows some more examples.

<pre class="FGT"></pre>
			<table id="table004-3" class="No-Table-Style _idGenTablePara-2">
				<colgroup>
					<col />
					<col />
					<col />
				</colgroup>
				<thead>
					<tr class="No-Table-Style">
						<td class="No-Table-Style Table-EX-Col-Head-Cell">
							<p class="TBCH">Loop</p>
						</td>
						<td class="No-Table-Style Table-EX-Col-Head-Cell">
							<p class="TBCH">Output</p>
						</td>
						<td class="No-Table-Style Table-EX-Col-Head-Cell">
							<p class="TBCH">Explanation</p>
						</td>
					</tr>
				</thead>
				<tbody>
					<tr class="No-Table-Style">
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<pre class="TB_EX_1">i = 0; sum = 0; </pre>
							<pre class="TB_EX_1">while (sum &lt; 10) </pre>
							<pre class="TB_EX_1">{ </pre>
							<pre class="TB_EX_1">   i++; sum = sum + i; </pre>
							<pre class="TB_EX_1">   <span class="TB_EX7e _idGenCharOverride-6">Print</span> i <span class="TB_EX7e _idGenCharOverride-6">and</span> sum; </pre>
							<pre class="TB_EX_1">}</pre>
						</td>
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<pre class="TB_EX_1">1 1</pre>
							<pre class="TB_EX_1">2 3</pre>
							<pre class="TB_EX_1">3 6</pre>
							<pre class="TB_EX_1">4 10</pre>
						</td>
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<p class="TB_1">When <span class="TB_EX _idGenCharOverride-7">sum</span> is 10, the loop condition is false, and the loop ends.</p>
						</td>
					</tr>
					<tr class="No-Table-Style">
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<pre class="TB_EX_1">i = 0; sum = 0; </pre>
							<pre class="TB_EX_1">while (sum &lt; 10) </pre>
							<pre class="TB_EX_1">{ </pre>
							<pre class="TB_EX_1">   i++; sum = sum - i; </pre>
							<pre class="TB_EX_1">   <span class="TB_EX7e _idGenCharOverride-6">Print</span> i <span class="TB_EX7e _idGenCharOverride-6">and</span> sum; </pre>
							<pre class="TB_EX_1">}</pre>
						</td>
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<pre class="TB_EX_1">1 -1</pre>
							<pre class="TB_EX_1">2 -3</pre>
							<pre class="TB_EX_1">3 -6</pre>
							<pre class="TB_EX_1">4 -10</pre>
							<pre class="TB_EX_1">. . .</pre>
						</td>
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<p class="TB_1">Because <span class="TB_EX _idGenCharOverride-7">sum</span> never reaches 10, this is an “infinite loop” (see <a href="bjlo2e_ch04-2.xhtml#_idTextAnchor359">Common Error 4.2</a>).</p>
						</td>
					</tr>
					<tr class="No-Table-Style">
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<pre class="TB_EX_1">i = 0; sum = 0; </pre>
							<pre class="TB_EX_1">while (sum &lt; 0) </pre>
							<pre class="TB_EX_1">{ </pre>
							<pre class="TB_EX_1">   i++; sum = sum - i; </pre>
							<pre class="TB_EX_1">   <span class="TB_EX7e _idGenCharOverride-6">Print</span> i <span class="TB_EX7e _idGenCharOverride-6">and</span> sum; </pre>
							<pre class="TB_EX_1">}</pre>
						</td>
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<p class="TB_1">(No output)</p>
						</td>
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<p class="TB_1">The statement <span class="TB_EX _idGenCharOverride-7">sum &lt; 0</span> is false when the condition is first checked, and the loop is never executed.</p>
						</td>
					</tr>
					<tr class="No-Table-Style">
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<pre class="TB_EX_1">i = 0; sum = 0; </pre>
							<pre class="TB_EX_1">while (sum &gt;= 10) </pre>
							<pre class="TB_EX_1">{ </pre>
							<pre class="TB_EX_1">   i++; sum = sum + i; </pre>
							<pre class="TB_EX_1">   <span class="TB_EX7e _idGenCharOverride-6">Print</span> i <span class="TB_EX7e _idGenCharOverride-6">and</span> sum; </pre>
							<pre class="TB_EX_1">}</pre>
						</td>
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<p class="TB_1">(No output)</p>
						</td>
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<p class="TB_1">The programmer probably thought, “Stop when the sum is at least 10.” However, the loop condition controls when the loop is executed, not when it ends (see <a href="bjlo2e_ch04-2.xhtml#_idTextAnchor357">Common Error 4.1</a>).</p>
						</td>
					</tr>
					<tr class="No-Table-Style">
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<pre class="TB_EX_1">i = 0; sum = 0; </pre>
							<pre class="TB_EX_1">while (sum &lt; 10) ;</pre>
							<pre class="TB_EX_1">{ </pre>
							<pre class="TB_EX_1">   i++; sum = sum + i; </pre>
							<pre class="TB_EX_1">   <span class="TB_EX7e _idGenCharOverride-6">Print</span> i <span class="TB_EX7e _idGenCharOverride-6">and</span> sum; </pre>
							<pre class="TB_EX_1">}</pre>
						</td>
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<p class="TB_1">(No output, program does not terminate)</p>
						</td>
						<td class="No-Table-Style Table-Ex-Cell _idGenCellOverride-1">
							<p class="TB_1">Note the semicolon before the <span class="TB_EX _idGenCharOverride-7">{</span>. This loop has an empty body. It runs forever, checking whether <span class="TB_EX _idGenCharOverride-7">sum &lt; 0</span> and doing nothing in the body.</p>
						</td>
					</tr>
				</tbody>
			</table>
      
      