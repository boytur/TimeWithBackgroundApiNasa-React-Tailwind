import React, { useState, useEffect } from 'react';

function Header() {
    const [apodData, setApodData] = useState(null);
    const [timeData, setTimeData] = useState(null);

    useEffect(() => {
        const fetchApodData = async (date) => {
            const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=pAspQv7IGPSh6DeofdNPNG5JvOjEKvJTDkU4YjpS&date=${date}`);
            const data = await response.json();
            setApodData(data);
        };

        const fetchTimeData = async () => {
            const response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Bangkok');
            const data = await response.json();
            setTimeData(data);
        };

        const randomDate = new Date(new Date().getTime() - Math.random() * 1000 * 60 * 60 * 24 * 365); // generate a random date from the past year
        const formattedDate = `${randomDate.getFullYear()}-${randomDate.getMonth() + 1}-${randomDate.getDate()}`; // format date as "yyyy-mm-dd"
        fetchApodData(formattedDate);
        fetchTimeData();

        // Update APOD data every 10 seconds
        const apodIntervalId = setInterval(() => {
            const newRandomDate = new Date(new Date().getTime() - Math.random() * 1000 * 60 * 60 * 24 * 365);
            const newFormattedDate = `${newRandomDate.getFullYear()}-${newRandomDate.getMonth() + 1}-${newRandomDate.getDate()}`;
            fetchApodData(newFormattedDate);
        }, 10000);

        // Update time every 1 second
        const timeIntervalId = setInterval(() => {
            fetchTimeData();
        }, 1000);

        // Clean up intervals
        return () => {
            clearInterval(apodIntervalId);
            clearInterval(timeIntervalId);
        };
    }, []);

    if (!apodData || !timeData) {
        return <div className=' flex flex-col w-full h-screen justify-center text-center text-[10rem]'>Loading...</div>;
    }

    const { datetime } = timeData;
    const date = new Date(datetime);
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

    return (
        <div className='w-full h-screen absolute'>
            <img className=' flex w-full absolute object-cover h-screen justify-center' src={apodData.url} alt={apodData.title} />
            <div className=' flex w-full h-full  z-50 absolute flex-col justify-center items-center'>
                <div className='text-center absolute w-64 rounded-lg bg-black/60 md:w-[45rem] md:h-[20rem]'>
                    <p className='text-white text-[3rem] md:text-[10rem] font-bold'>
                        {hours}:{minutes}:{seconds}
                    </p>
                    <h1 className='text-white text-[1rem] md:text-2xl'>{apodData.title}</h1>
                </div>
            </div>
        </div>
    );
}

export default Header;
