import ActiveLastBreadcrumb from "../components/common/components/Link";
import { Link } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { auth, firestore } from "../Auth/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { useState, useEffect } from "react";
import i18n from "../components/common/components/LangConfig";
import RecommendationSection from "../components/common/components/RecommendationSection";
import SubscriptionSection from "../components/common/components/SubscriptionSection";
import { getNextBasketRecommendations } from "../components/common/functions/recommendationUtils";
import { ITEMS } from "../components/common/functions/items";

const Account = () => {
  const [activeTab, setActiveTab] = useState("myProfile");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [cancellations, setCancellations] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser.uid;
        const userDocRef = doc(firestore, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(userData.email);
          setAddress(userData.address);
        } else {
          console.log("User document not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    
    // Load orders, returns, cancellations from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const storedReturns = JSON.parse(localStorage.getItem("returns")) || [];
    const storedCancellations = JSON.parse(localStorage.getItem("cancellations")) || [];
    
    setOrders(storedOrders);
    setReturns(storedReturns);
    setCancellations(storedCancellations);

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setRecommendedItems(getNextBasketRecommendations({ products: ITEMS, cartItems }));
  }, []);

  const handleSaveChanges = async () => {
    try {
      // Update user account data in Firestore
      await setDoc(doc(firestore, "users", auth.currentUser.uid), {
        firstName,
        lastName,
        email,
        address,
      });
      setMessage(i18n.t("accountPage.setMassage"));
      setOpen(true);
    } catch (error) {
      setError(error.message);
      setOpen(true);
    }
  };

  return (
    <div className="flex flex-col mx-4 md:ml-36 mt-48 gap-20 justify-center md:justify-between ">
      <div className="flex justify-between   flex-col gap-4 md:flex-row ">
        <ActiveLastBreadcrumb
          path={`${i18n.t("accountPage.home")}/ ${i18n.t(
            "accountPage.myAccount"
          )}`}
        />
        <h1 className="text-sm md:mr-44">
          {i18n.t("accountPage.welcome")}{" "}
          <span className="text-red-600">
            {firstName} {lastName}
          </span>
        </h1>
      </div>
      <div className="flex flex-col md:flex-row gap-28">
        <nav className="flex flex-col gap-6 text-gray-400 min-w-fit">
          <div>
            <h1 className="text-black text-sm md:text-base font-medium mb-4">
              {i18n.t("accountPage.ManageMyAccount")}
            </h1>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab("myProfile")}
                  className={`w-full text-left px-4 py-2 rounded transition-all ${
                    activeTab === "myProfile"
                      ? "bg-red-600 text-white font-medium"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {i18n.t("accountPage.myProfile")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("addressBook")}
                  className={`w-full text-left px-4 py-2 rounded transition-all ${
                    activeTab === "addressBook"
                      ? "bg-red-600 text-white font-medium"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {i18n.t("accountPage.addressBook")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("paymentOptions")}
                  className={`w-full text-left px-4 py-2 rounded transition-all ${
                    activeTab === "paymentOptions"
                      ? "bg-red-600 text-white font-medium"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {i18n.t("accountPage.myPaymentOptions")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("subscriptions")}
                  className={`w-full text-left px-4 py-2 rounded transition-all ${
                    activeTab === "subscriptions"
                      ? "bg-red-600 text-white font-medium"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  My Subscriptions
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h1 className="text-black text-sm md:text-base font-medium mb-4">
              {i18n.t("accountPage.myOrders")}
            </h1>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab("myOrders")}
                  className={`w-full text-left px-4 py-2 rounded transition-all ${
                    activeTab === "myOrders"
                      ? "bg-red-600 text-white font-medium"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {i18n.t("accountPage.myOrders")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("myReturns")}
                  className={`w-full text-left px-4 py-2 rounded transition-all ${
                    activeTab === "myReturns"
                      ? "bg-red-600 text-white font-medium"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {i18n.t("accountPage.myReturns")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("myCancellations")}
                  className={`w-full text-left px-4 py-2 rounded transition-all ${
                    activeTab === "myCancellations"
                      ? "bg-red-600 text-white font-medium"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {i18n.t("accountPage.myCancelations")}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <Link
              to="/wishlist"
              className="inline-block px-4 py-2 text-black font-medium hover:underline"
            >
              {i18n.t("accountPage.myWishlist")}
            </Link>
          </div>
        </nav>

        {/* Content Area */}
        <div className="shadow w-full flex flex-col py-10 md:px-20 px-5 rounded">
          {/* My Profile Tab */}
          {activeTab === "myProfile" && (
            <div className="flex flex-col gap-6 md:w-[710px]">
              <span className="text-xl font-medium text-red-600">
                {i18n.t("accountPage.editYourProfile")}
              </span>
              <div className="flex flex-col md:flex-row gap-6 md:gap-[50px] justify-between">
                <div className="flex flex-col gap-2 w-full">
                  <span className="text-sm md:text-base">
                    {i18n.t("accountPage.firstName")}
                  </span>
                  <input
                    type="text"
                    placeholder={firstName ? firstName : "your first name"}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="rounded bg-gray-100 px-4 py-3 text-gray-700 text-sm md:text-base outline-none focus:border border-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <span className="text-sm md:text-base">
                    {i18n.t("accountPage.lastName")}
                  </span>
                  <input
                    type="text"
                    placeholder={lastName ? lastName : "your last name"}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="rounded bg-gray-100 px-4 py-3 text-gray-700 text-sm md:text-base outline-none focus:border border-gray-300"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 md:gap-[50px] justify-between">
                <div className="flex flex-col gap-2 w-full">
                  <span className="text-sm md:text-base">
                    {i18n.t("accountPage.email")}
                  </span>
                  <input
                    type="email"
                    placeholder={email ? email : "your email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded bg-gray-100 px-4 py-3 text-gray-700 text-sm md:text-base outline-none focus:border border-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <span className="text-sm md:text-base">
                    {i18n.t("accountPage.address")}
                  </span>
                  <input
                    type="text"
                    placeholder={address ? address : "your address"}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="rounded bg-gray-100 px-4 py-3 text-gray-700 text-sm md:text-base outline-none focus:border border-gray-300"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <span className="text-sm md:text-base font-medium">
                  {i18n.t("accountPage.passwordChanges")}
                </span>
                <input
                  type="password"
                  placeholder={i18n.t("accountPage.currentPassword")}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="rounded bg-gray-100 px-4 py-3 text-gray-700 text-sm md:text-base outline-none focus:border border-gray-300"
                />
                <input
                  type="password"
                  placeholder={i18n.t("accountPage.newPassword")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded bg-gray-100 px-4 py-3 text-gray-700 text-sm md:text-base outline-none focus:border border-gray-300"
                />
                <input
                  type="password"
                  placeholder={i18n.t("accountPage.confirmPassword")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded bg-gray-100 px-4 py-3 text-gray-700 text-sm md:text-base outline-none focus:border border-gray-300"
                />
              </div>
              <div className="ml-auto flex items-center gap-8 text-sm md:text-base">
                <button
                  onClick={() => {
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setAddress("");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="hover:underline underline-offset-4 ease-in-out duration-300"
                >
                  {i18n.t("accountPage.cancel")}
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="bg-red-600 text-white px-6 md:px-12 py-3 rounded hover:bg-red-500 transition-transform duration-100"
                >
                  {i18n.t("accountPage.saveChanges")}
                </button>
              </div>
            </div>
          )}

          {/* Address Book Tab */}
          {activeTab === "addressBook" && (
            <div className="flex flex-col gap-6 md:w-[710px]">
              <span className="text-xl font-medium text-red-600">
                {i18n.t("accountPage.addressBook")}
              </span>
              <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {i18n.t("accountPage.addressBook")}
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>{i18n.t("accountPage.firstName")}:</strong>{" "}
                    {firstName}
                  </p>
                  <p>
                    <strong>{i18n.t("accountPage.lastName")}:</strong> {lastName}
                  </p>
                  <p>
                    <strong>{i18n.t("accountPage.address")}:</strong> {address}
                  </p>
                  <p>
                    <strong>{i18n.t("accountPage.phone")}:</strong> Not set
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("myProfile")}
                className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-500 w-fit"
              >
                {i18n.t("accountPage.editYourProfile")}
              </button>
            </div>
          )}

          {/* Payment Options Tab */}
          {activeTab === "paymentOptions" && (
            <div className="flex flex-col gap-6 md:w-[710px]">
              <span className="text-xl font-medium text-red-600">
                {i18n.t("accountPage.myPaymentOptions")}
              </span>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {i18n.t("redButtons.applyCoupon")}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {i18n.t("payment.payment")}
                  </p>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="flex-1 rounded bg-white px-4 py-2 border border-gray-300 focus:outline-none"
                    />
                    <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500">
                      {i18n.t("redButtons.applyCoupon")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Orders Tab */}
          {activeTab === "myOrders" && (
            <div className="flex flex-col gap-6 md:w-[710px]">
              <span className="text-xl font-medium text-red-600">
                {i18n.t("accountPage.myOrders")}
              </span>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-indigo-50 to-purple-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-gray-600 text-sm">
                            Order #{idx + 1}
                          </p>
                          <p className="text-lg font-semibold text-gray-800">
                            ${order.total || "0.00"}
                          </p>
                        </div>
                        <span className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full">
                          Delivered
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Items: {order.items?.length || 0}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  {i18n.t("Snackbar.noItems")}
                </p>
              )}
            </div>
          )}

          {/* My Returns Tab */}
          {activeTab === "myReturns" && (
            <div className="flex flex-col gap-6 md:w-[710px]">
              <span className="text-xl font-medium text-red-600">
                {i18n.t("accountPage.myReturns")}
              </span>
              {returns.length > 0 ? (
                <div className="space-y-4">
                  {returns.map((ret, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-yellow-50 to-orange-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-gray-600 text-sm">
                            Return #{idx + 1}
                          </p>
                          <p className="text-lg font-semibold text-gray-800">
                            {ret.reason || "No reason provided"}
                          </p>
                        </div>
                        <span className="bg-yellow-200 text-yellow-800 text-xs px-3 py-1 rounded-full">
                          Pending
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No returns yet
                </p>
              )}
            </div>
          )}

          {/* My Cancellations Tab */}
          {activeTab === "myCancellations" && (
            <div className="flex flex-col gap-6 md:w-[710px]">
              <span className="text-xl font-medium text-red-600">
                {i18n.t("accountPage.myCancelations")}
              </span>
              {cancellations.length > 0 ? (
                <div className="space-y-4">
                  {cancellations.map((cancel, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-red-50 to-pink-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-gray-600 text-sm">
                            Cancellation #{idx + 1}
                          </p>
                          <p className="text-lg font-semibold text-gray-800">
                            {cancel.reason || "No reason provided"}
                          </p>
                        </div>
                        <span className="bg-red-200 text-red-800 text-xs px-3 py-1 rounded-full">
                          Cancelled
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No cancellations yet
                </p>
              )}
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === "subscriptions" && (
            <div className="flex flex-col gap-6">
              <SubscriptionSection />
            </div>
          )}
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-10 mt-8">
        <RecommendationSection
          title="Next Basket Recommendations"
          items={recommendedItems}
        />
      </div>
      {/* Snackbar for displaying success or error messages */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error ? error : message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Account;
