import React, { useState, useEffect } from 'react';
import '../Styles/List.scss';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { setTripList } from '../redux/state';
import ListingCard from '../components/ListingCard';

function TripList() {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const tripList = useSelector((state) => state.user.tripList);
  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/trips`, { method: 'GET' });
      const data = await response.json();
      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.log('Fetch Trip List Failed!', err.message);
    }
  };

  useEffect(() => {
    getTripList();
  }, []);

  return loading ? <Loader /> : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList?.map(({listingId,startDate,endDate,totalPrice,booking=true})=>(
        <ListingCard listingId={listingId._id} listingPhotoPaths={listingId.listingPhotoPaths} city={listingId.city}province={listingId.province} country={listingId.country} category={listingId.category} startDate={startDate} endDate={endDate} totalPrice={totalPrice}
        booking={booking}
        />))}
      </div>
    </>
  );
}

export default TripList;
