// src/components/StadiumManager.jsx
import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";

import "./stadium-manager.scss";

const StadiumManager = () => {
    const [avatar, setAvatar] = useState(null);
    const [name, setName] = useState(null);
    const [phone, setPhone] = useState(null);
    const [zalo, setZalo] = useState(null);
    const [facebook, setFacebook] = useState(null);

    const stadiumManagerData = {
        avatar: "path/to/avatar.jpg",
        name: "John Doe",
        phone: "123456789",
        zalo: "https://zalo.me/123456789",
        facebook: "https://www.facebook.com/johndoe",
    };

    useEffect(() => {
        // fetch("/api/v1/stadium-manager")
        //     .then((response) => response.json())
        //     .then((data) => setManagerInfo(data))
        //     .catch((error) =>
        //         console.error("Error fetching stadium manager data:", error)
        //     );
        setAvatar(stadiumManagerData.avatar);
        setName(stadiumManagerData.name);
        setPhone(stadiumManagerData.phone);
        setZalo(stadiumManagerData.zalo);
        setFacebook(stadiumManagerData.facebook);

    }, []);

    return (
        <Popup trigger={<button className="flat-button">Thông tin quản lý sân</button>} modal nested>
            <div className="popup">
                <div className="popup-inner">
                    <h2>Thông tin người quản lý sân bóng</h2>
                    <img src={avatar} alt="Avatar" />
                    <p>Tên người quản lý: {name}</p>
                    <p>Số điện thoại: {phone}</p>
                    <p>
                        Zalo: <a href={zalo}>Link Zalo</a>
                    </p>
                    <p>
                        Facebook: <a href={facebook}>Link Facebook</a>
                    </p>
                </div>
            </div>
        </Popup>
    );
};

export default StadiumManager;
