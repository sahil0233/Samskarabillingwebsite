import React, {useEffect, useState} from 'react'
import axios from 'axios';
import Link from 'next/link'
let finalData = {};
const DataTable = () => {
  const [selectedCollection, setSelectedCollection] = useState('');
  const [data, setData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [goldRate, setGoldRate] = useState('');
  const [tableData, setTableData] = useState([]);

  const calculateNetGoldRate = () => {
    const netRateData = data.map(item => {
      const netRate = Math.floor(goldRate * item['fine_gold']); // Calculate net gold rate
      let sp= 0;
      if(selectedCollection=='Polki'){
        sp=Math.floor(netRate+item['sp_nogold']);
      }else if(selectedCollection=='Round'){
        sp = Math.floor(netRate+item['net_diamondrate']+item['net_makingcharge']);
      }
      return { ...item, netGoldRate: netRate, sellingPrice:sp };
    });
    finalData = netRateData;
    setTableData(finalData);
  };
  useEffect(() => {
    calculateNetGoldRate();
  }, [goldRate, data]);

  useEffect(() => {
    // Fetch default collection data on component mount (assuming you have a default collection)
    const defaultCollection = 'Polki'; // Replace this with your default collection name
    setSelectedCollection(defaultCollection);
    fetchCollectionData(defaultCollection);
  }, []); // Empty dependency array to fetch data only on component mount

  const handleGoldRateChange = (e) => {
    setGoldRate(e.target.value);
  };

  const handleSearch = () => {
    const searchingvalue = document.getElementById('search-item').value.toUpperCase();
    const foundEntry = finalData.find(item => item.item_number === searchingvalue);
    if(foundEntry){
      setTableData([foundEntry]);
    }else {
      alert('Wrong!! Item number');
      setTableData(finalData);
    }
  }

  

  const fetchCollectionData = async (collectionName) => {
    try {
      const response = await axios.get(`/api/hello?collectionName=${collectionName}`);
      setData(response.data.data);

      // Extract table headers from the first item in the collection (excluding _id)
      if (response.data.data.length > 0) {
        const headers = Object.keys(response.data.data[0]).filter(header => header !== '_id');
        setTableHeaders(headers);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSelectChange = async (e) => {
    const collectionName = e.target.value;
    setSelectedCollection(collectionName);
    fetchCollectionData(collectionName);
  };
  

  return (
    <div className=''> 
      <div className='m-4 flex justify-center '>
        <select className='w-60 h-10 rounded bg-gray-300 mr-2 hover:cursor-pointer' value={selectedCollection} onChange={handleSelectChange}>
          <option value="Polki">Polki</option>
          <option value="Round">Round</option>
        </select>
        <div className='ml-8 h-10'>
          <label className= "rounded-sem" htmlFor="goldRateInput">Today's Gold Rate:</label>
          <input className='h-10 ml-2 rounded-sm border-solid border-4'
            type="number"
            id="goldRateInput"
            value={goldRate}
            onChange={handleGoldRateChange}
            placeholder="Enter today's gold rate"
          />
        </div>
        <Link className="ml-2 py-2 px-8 rounded bg-black text-white" href="/Invoice">Bill</Link>
      </div>
      <div className='border-2 shadow-md sm:rounded-lg'>
        <div className='relative m-4 flex w-96 flex-wrap items-stretch'>
          <input onKeyDown={(e) => {
            if(e.key === 'Enter')handleSearch();
          }} type="search" id='search-item' name='search-item' placeholder='search' className='relative m-0 block min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary'></input>
          <button onClick={handleSearch} className='input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200'>
          <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5">
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd" />
      </svg>
          </button>
        </div>
      
        <div className='flex max-h-screen overflow-y-auto relative overflow-x-auto shadow-md sm:rounded-lg'>
          { tableData.length > 0 && goldRate ?(
            <table id ="displayed-data" className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0'>
                <tr>
                  {/* Render table headers dynamically */}
                  <th scope='col' className='px-6 py-3'>Item Number</th>
                  <th scope='col' className='px-6 py-3'>Selling Price</th>
                  {tableHeaders.filter(header => header != 'item_number').map((header, index) => (
                    <th scope='col' className='px-6 py-3' key={index}>{header}</th>
                  ))}
                  <th scope='col' className='px-6 py-3'>Today gold rate</th>
                  <th scope='col' className='px-6 py-3'>Net gold rate</th>
                </tr>
              </thead>
              
                <tbody>
                { selectedCollection === 'Polki' ?(
                  tableData.map((row) => (
                    <tr className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700' key = {row._id}>
                      <th scope="row" className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>{row.item_number}</th>
                      <td className='px-6 py-4'>{row['sellingPrice']}</td>
                      <td className='px-6 py-4'>{row.kt}</td>
                      <td className='px-6 py-4'>{row.purity}</td>
                      <td className='px-6 py-4'>{row.gross_wt}</td>
                      <td className='px-6 py-4'>{row.net_wt}</td>
                      <td className='px-6 py-4'>{row.dia_wt}</td>
                      <td className='px-6 py-4'>{row.dia_pcs}</td>
                      <td className='px-6 py-4'>{row.diamond_rate}</td>
                      <td className='px-6 py-4'>{row.net_diamondrate}</td>
                      <td className='px-6 py-4'>{row.choki_rate}</td>
                      <td className='px-6 py-4'>{row.polki_wt}</td>
                      <td className='px-6 py-4'>{row.net_makingcharge}</td>
                      <td className='px-6 py-4'>{row.polki_making}</td>
                      <td className='px-6 py-4'>{row.polki_pcs}</td>
                      <td className='px-6 py-4'>{row.diamond_clarity}</td>
                      <td className='px-6 py-4'>{row.fine_gold}</td>
                      <td className='px-6 py-4'>{row.sp_nogold}</td>
                      <td className='px-6 py-4'>{goldRate}</td>
                      <td className='px-6 py-4'>{row['netGoldRate']}</td>

                    </tr>
                  ))
                  ): selectedCollection === 'Round' ? (
                    tableData.map((row) => (
                      <tr className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700' key = {row._id}>
                      <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>{row.item_number}</th>
                      <td className='px-6 py-4'>{row['sellingPrice']}</td>
                      <td className='px-6 py-4'>{row.kt}</td>
                      <td className='px-6 py-4'>{row.purity}</td>
                      <td className='px-6 py-4'>{row.gross_wt}</td>
                      <td className='px-6 py-4'>{row.net_wt}</td>
                      <td className='px-6 py-4'>{row.dia_wt}</td>
                      <td className='px-6 py-4'>{row.dia_pcs}</td>
                      <td className='px-6 py-4'>{row.fine_gold}</td>
                      <td className='px-6 py-4'>{row.diamond_rate}</td>
                      <td className='px-6 py-4'>{row.net_diamondrate}</td>
                      <td className='px-6 py-4'>{row.makingchargepergm}</td>
                      <td className='px-6 py-4'>{row.net_makingcharge}</td>
                      <td className='px-6 py-4'>{goldRate}</td>
                      <td className='px-6 py-4'>{row['netGoldRate']}</td>
                    </tr>

                    ))): (
                      <tr>
                        <td colSpan="5">No data available for the selected collection</td>
                      </tr>
                    )}
                </tbody>
              
            </table>
          ):(
            <div className='mx-auto bg-red-100 border border-red-500 text-red-700 px-4 py-2 rounded-md'>
              Enter today's gold rate
            </div>

          )}

        </div>
      </div>
    </div>
  )
}

export default DataTable