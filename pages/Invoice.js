import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import numberToWords from 'number-to-words';

const Invoice = () => {

    const[finalData,setFinalData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [newItemNumber, setNewItemNumber] = useState('');
    
    //add emtpy row
    const addEmptyRow = () => {
      setTableData([...tableData, { s_no:'',item_number: '',desc:'' , gross_wt:'',net_wt:'',fine_gold:'',gold_rate:'',net_goldrate:'',dia_wt:'',diamond_rate:'',net_diamondrate:'',makingchargepergm:'',net_makingcharge:'',net_amount:'' }]);
    };

    const deleteRow = (index) => {
      const updatedTableData = [...tableData];
      updatedTableData.splice(index, 1);
      setTableData(updatedTableData);
    };

    const generalEnterPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevents the newline character from being inserted
      }
    };

    const handleEnter = (e, index) => {
      
      if (e.key === 'Enter') {
        const value = (e.currentTarget.textContent).toUpperCase();
        console.log(value)
        e.preventDefault();
        const item = finalData.find((obj) => obj.item_number === value);
  
        if (item) {
          
          const updatedTableData = [...tableData];
          updatedTableData[index] = { ...item };
          setNewItemNumber(value);
          setTableData(updatedTableData);
        }
      }
    };
    useEffect(() => {
      
    }, [tableData])

    
    
    const handleInputChange = (e, index, key) => {
      if(e.key === 'Enter'){
      e.preventDefault();
      const value = e.currentTarget.textContent;
      const updatedTableData = [...tableData];
      updatedTableData[index] = { ...updatedTableData[index], [key]: value };
      updatedTableData[index].net_goldrate = calculateNetGoldRate(updatedTableData[index]);
      updatedTableData[index].net_amount = calculateNetAmount(updatedTableData[index])
      setTableData(updatedTableData);
    }
    };

    const calculateNetGoldRate = (rowData) => {
      // console.log(rowData.fine_gold)
      // console.log(rowData.gold_rate)
      const fine_gold = parseFloat(rowData.fine_gold) || 0;
      const gold_rate = parseFloat(rowData.gold_rate) || 0;
      return Math.floor(fine_gold * gold_rate);
    };

    const calculateNetAmount = (rowData) => {
      // console.log(rowData.fine_gold)
      // console.log(rowData.gold_rate)
      const net_goldrate = parseFloat(rowData.net_goldrate) || 0;
      const net_diamondrate = parseFloat(rowData.net_diamondrate) || 0;
      const net_makingcharge = parseFloat(rowData.net_makingcharge) || 0;
      rowData.net_amount = Math.floor(net_goldrate+net_diamondrate+net_makingcharge);
      return rowData.net_amount;
    };
    const calculateTotalAmount = () => {
      const totalAmount = tableData.reduce((acc, rowData) => {
        return acc + parseFloat(rowData.net_amount || 0);
      }, 0);
      return Math.floor(totalAmount);
    };
    const totalAmountInWords = (numberToWords.toWords(parseFloat(calculateTotalAmount()))).toUpperCase();
    

    useEffect(() => {
        // Fetch 
        fetchCollectionData();
        
      }, []);

      const fetchCollectionData = async () => {
        try {
          const response = await axios.get('/api/AllData');
          const final = await response.data.combinedData;
          setFinalData(final);
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      


      
    const handlePrint = () => {
        window.print(); // This triggers the browser's print dialog
      };
  return (
    <div className='flex flex-col items-center justify-center w-screen'>
        <div className="w-11/12 h-auto m-4 p-4 border-4 border-black invoice-content border-collapse">
        <div id='invoice-header' className='flex flex-col'>
            <h1 className='font-bold text-center text-2xl tracking-widest' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Samskara Jewels</h1>
            <h3 className='text-center text-xs' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>B-102,Gaurav Tower, Malviya Nagar</h3>
            <h3 className='text-center text-xs' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Jaipur,Rajasthan-302017, Mob No. : 9649254666</h3>
            <h3 className='text-center text-xs' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>MSME Certified UDYAM REG. No. : UDYAM-RJ-17-0317873</h3>
            <h2 className='text-sm font-semibold h-10 border-b border-black flex items-center justify-center' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>INVOICE</h2>
        </div>
        <div className='flex justify-between py-2 my-2  border-b'>
            <div className='ml-8 space-y-2'>
                <div>
                    <label className='text-xs font-semibold' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Invoice No. :</label>
                    <input className='ml-2 text-xs' placeholder='invoice no.' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}></input>
                </div>
                <div>
                    <label className='text-xs font-semibold' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Customer Name :</label>
                    <input className='ml-2 text-xs' placeholder='customer name' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}></input>
                </div>
                <div>
                    <label className='text-xs font-semibold' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Address :</label>
                    <input className='ml-2 text-xs' placeholder='address' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}></input>
                </div>
            </div>
            <div className='space-y-2'>
                <div>
                    <label className='text-xs font-semibold' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Date</label>
                    <input className='ml-2 text-xs' placeholder='date' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}></input>
                </div>
                <div>
                    <label className='text-xs font-semibold' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Mobile Number :</label>
                    <input className='ml-2 text-xs' placeholder='number' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}></input>
                </div>
                <div>
                    <label className='text-xs font-semibold' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Deal by</label>
                    <input className='ml-2 text-xs' placeholder='name' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}></input>
                </div>
            </div>
        </div>
        <button onClick={addEmptyRow} className='print:hidden'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          {/* Add SVG icon here */}
          <path d="M12 5v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
            <table className='border-collapse border-2 w-full table-auto'>
                <thead className='text-xs'>
                    <tr className='align-top'>
                      <th className='print:hidden'></th>
                        <th className='border border-gray-400'contentEditable={true} >S.No</th>
                        <th className='border border-gray-400'contentEditable={true} >Item code</th>
                        <th className='border border-gray-400'contentEditable={true} >Description</th>
                        <th className='border border-gray-400'contentEditable={true} >Gross wt.<span className='block text-8px'>(gm)</span></th>
                        <th className='border border-gray-400'contentEditable={true} >Net wt.<span className='block text-8px'>(gm)</span></th>
                        <th className='border border-gray-400'contentEditable={true} >Fine gold<span className='block text-8px'>(gm)</span></th>
                        <th className='border border-gray-400'contentEditable={true} >Gold rate<span className='block text-8px'>(24kt)(per gm)</span></th>
                        <th className='border border-gray-400'contentEditable={true} >Net Gold rate</th>
                        <th className='border border-gray-400'contentEditable={true} >DIA wt.<span className='block text-8px'>(crt)</span></th>
                        <th className='border border-gray-400'contentEditable={true} >DIA rate<span className='block text-8px'>(per crt)</span></th>
                        <th className='border border-gray-400'contentEditable={true} >Net DIA rate</th>
                        <th className='border border-gray-400'contentEditable={true} >Making charges<span className='block text-8px'>(per gm)</span></th>
                        <th className='border border-gray-400'contentEditable={true} >Net making charges</th>
                        <th className='border border-gray-400'contentEditable={true} >Extra</th>
                        <th className='border border-gray-400'contentEditable={true} >Net Amount</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {tableData.map((rowData,index) => (
                      <tr key={index} className='text-center'>
                        <td className='print:hidden w-2 cursor-pointer'onClick={() => deleteRow(index)}>X</td>
                        <td className='border border-gray-400' contentEditable={true}>{index+1}</td>
                        <td className='border border-gray-400' contentEditable={true}
                          onKeyPress={(e) => handleEnter(e, index)}>
                        </td>
                        <td className='border border-gray-400' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}></td>
                        <td className='border border-gray-400'contentEditable={true} >{rowData.gross_wt}</td>
                        <td className='border border-gray-400'contentEditable={true} >{rowData.net_wt}</td>
                        <td className='border border-gray-400'contentEditable={true}  >{rowData.fine_gold}</td>
                        <td className='border border-gray-400' contentEditable={true} onKeyDown={(e) => handleInputChange(e, index,'gold_rate')}></td>
                        <td className='border border-gray-400' contentEditable={true} >{rowData.net_goldrate}</td>
                        <td className='border border-gray-400'contentEditable={true} >{rowData.dia_wt}</td>
                        <td className='border border-gray-400'contentEditable={true} >{rowData.diamond_rate}</td>
                        <td className='border border-gray-400'contentEditable={true} >{rowData.net_diamondrate}</td>
                        <td className='border border-gray-400'contentEditable={true} >{rowData.makingchargepergm}</td>
                        <td className='border border-gray-400'contentEditable={true} >{rowData.net_makingcharge}</td>
                        <td className='border border-gray-400'contentEditable={true} ></td>
                        <td className='border border-gray-400'contentEditable={true} >{rowData.net_amount}</td>
                      </tr>
                    ))}

                    
                    
                    

                </tbody>
            </table>
            <div className='px-2 flex justify-between border-l-2 border-r-2 border-b-2 border-black text-base'>
                    <div className='flex gap-2'>
                        <h3 className='font-medium text-center' colSpan={3}>Total Amount in Words: </h3>
                        <h3 className='text-left' colSpan={9} contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>{totalAmountInWords} ONLY</h3>
                    </div>
                    <div className='flex'>
                        <h3 className=' font-medium' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Total Amount : {calculateTotalAmount()}</h3>
                    </div>
                </div>
            <h3 className='border-t mt-4 pt-2 font-medium text-base' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Terms & Conditions :</h3>
            <ol className='border-b list-decimal text-sm' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>
                <li className='ml-4' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Net invoice value includes Gold value,Product making charge,Diamond value and Stone cost(as applicable)</li>
                <li className='ml-4' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Recieved above products in good condition</li>
            </ol>
            
            <h3 className='text-right font-medium text-base' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>For Samskara Jewels</h3>
            <div className='flex justify-between h-12 items-end text-base' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>
                <h3 className='font-medium text-base' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Customer Signature</h3>
                <h3 className='font-medium text-base' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Authorized Signature</h3>
            </div>
            <h3 className='pt-2 text-center border-t text-sm' contentEditable={true} onKeyDown={(e) => generalEnterPress(e)}>Subject to jaipur jurisdiction only E & O.E.</h3>
        
        </div>
        <button
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 print:hidden"
        >
          Print Invoice
        </button>
    </div>
    
    
  )
}

export default Invoice
