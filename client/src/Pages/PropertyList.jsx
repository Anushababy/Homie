import { useEffect, useState, useCallback } from "react";
import "../Styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setPropertyList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const PropertyList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user);
  const propertyList = user?.propertyList;
  const dispatch = useDispatch();

  const getPropertyList = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${user._id}/properties`, {
        method: "GET"
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      dispatch(setPropertyList(data));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.log("Fetch all properties failed", err.message);
    }
  }, [user._id, dispatch]);

  useEffect(() => {
    if (user._id) {
      getPropertyList();
    }
  }, [user._id, getPropertyList]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Property List</h1>
      <div className="list">
        {propertyList?.map(
          ({
            _id,
            creator,
            listingPhotoPaths,
            city,
            province,
            country,
            category,
            type,
            price,
            booking = false,
          }) => (
            <ListingCard
              key={_id}
              listingId={_id}
              creator={creator}
              listingPhotoPaths={listingPhotoPaths}
              city={city}
              province={province}
              country={country}
              category={category}
              type={type}
              price={price}
              booking={booking}
            />
          )
        )}
      </div>
      <Footer />
    </>
  );
};

export default PropertyList;
