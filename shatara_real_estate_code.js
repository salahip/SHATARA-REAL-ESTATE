
// backend/index.js - Node.js Backend for Real Estate
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "real_estate_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("متصل بقاعدة البيانات");
});

app.get("/properties", (req, res) => {
  db.query("SELECT * FROM properties", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(5000, () => {
  console.log("الخادم يعمل على المنفذ 5000");
});

// frontend/src/components/PropertyList.js - React Component for Displaying Properties
import React, { useEffect, useState } from "react";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data));
  }, []);

  return (
    <div>
      <h2>عقارات مميزة</h2>
      <ul>
        {properties.map((property) => (
          <li key={property.id}>
            <h3>{property.name}</h3>
            <p>السعر: {property.price} جنيه</p>
            <img src={property.image} alt={property.name} width="200px" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;

// frontend/src/components/AdminDashboard.js - React Admin Dashboard Component
import React, { useState } from "react";

const AdminDashboard = () => {
  const [property, setProperty] = useState({ name: "", price: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/addProperty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(property),
    }).then(() => alert("تمت إضافة العقار بنجاح!"));
  };

  return (
    <div>
      <h2>إضافة عقار جديد</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="اسم العقار"
          onChange={(e) => setProperty({ ...property, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="السعر"
          onChange={(e) => setProperty({ ...property, price: e.target.value })}
        />
        <button type="submit">إضافة</button>
      </form>
    </div>
  );
};

export default AdminDashboard;
