import React from "react";
import "../Styles/List.scss";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

function WishList() {
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Wish List</h1>
      <div className="list">
        {wishList.length > 0 ? (
          wishList.map((listing) => (
            <ListingCard
              key={listing._id}
              listingId={listing._id}
              creator={listing.creator}
              listingPhotoPaths={listing.listingPhotoPaths}
              city={listing.city}
              province={listing.province}
              country={listing.country}
              category={listing.category}
              type={listing.type}
              price={listing.price}
              startDate={listing.startDate}
              endDate={listing.endDate}
              totalPrice={listing.totalPrice}
              booking={listing.booking}
            />
          ))
        ) : (
          <div>No items in your wish list.</div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default WishList;
