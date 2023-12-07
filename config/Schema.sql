CREATE TABLE
    Users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(255) NOT NULL,
        gender varchar(10),
        password VARCHAR(255),
        isAdmin TINYINT NOT NULL DEFAULT 0,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        addresses JSON,
        verification_code VARCHAR(255),
        code_valid_until TIMESTAMP,
        is_verified TINYINT NOT NULL DEFAULT 0
    );

CREATE TABLE
    Products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        brand VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        rating FLOAT NOT NULL DEFAULT 0,
        numReviews INT NOT NULL DEFAULT 0,
        price DECIMAL(19, 4) NOT NULL DEFAULT 0,
        countInStock INT NOT NULL DEFAULT 0,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    Reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        comment TEXT NOT NULL,
        userId INT NOT NULL,
        productId INT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES Users (id),
        FOREIGN KEY (productId) REFERENCES Products (id)
    );

CREATE TABLE
    Orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL,
        shippingAddress TEXT NOT NULL,
        billingAddress Text,
        paymentMethod VARCHAR(255) NOT NULL,
        itemsPrice DECIMAL(19, 4) NOT NULL DEFAULT 0.0,
        taxPrice DECIMAL(19, 4) NOT NULL DEFAULT 0.0,
        shippingPrice DECIMAL(19, 4) NOT NULL DEFAULT 0.0,
        totalPrice DECIMAL(19, 4) NOT NULL DEFAULT 0.0,
        isPaid TINYINT NOT NULL DEFAULT 0,
        paidAt TIMESTAMP NULL,
        isDelivered TINYINT NOT NULL DEFAULT 0,
        feedbackDescription VARCHAR(255),
        feedbackRating TINYINT,
        orderStatus ENUM ('Placed', 'Shipped', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Placed',
        deliveredAt TIMESTAMP NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES Users (id)
    );

CREATE TABLE
    OrderItems (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        qty INT NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(19, 4) NOT NULL,
        productId INT NOT NULL,
        orderId INT NOT NULL,
        FOREIGN KEY (productId) REFERENCES Products (id),
        FOREIGN KEY (orderId) REFERENCES Orders (id)
    );

CREATE TABLE
    PaymentResults (
        id INT PRIMARY KEY AUTO_INCREMENT,
        orderId INT NOT NULL,
        paymentId VARCHAR(255),
        status VARCHAR(255),
        updateTime VARCHAR(255),
        emailAddress VARCHAR(255),
        FOREIGN KEY (orderId) REFERENCES Orders (id)
    );

CREATE TABLE
    Issues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        priority ENUM ('Low', 'Medium', 'High') NOT NULL,
        status ENUM ('Open', 'In Progress', 'Closed') NOT NULL,
        assignee VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

INSERT INTO
    Products (
        Name,
        Image,
        Brand,
        Category,
        Description,
        Rating,
        NumReviews,
        Price,
        CountInStock
    )
VALUES
    (
        'Slim Fit Dress Shirt',
        'https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/11780934/2020/4/3/1ed79c22-68b5-491a-b673-e91e4411d8aa1585905063620HIGHLANDERMenOliveGreenBlackSlimFitCheckedCasualShirt1.jpg',
        'FashionBrand',
        'men',
        'A stylish slim fit dress shirt for the modern man.',
        4.5,
        25,
        59.99,
        10
    ),
    (
        'Chino Shorts',
        'https://assets.myntassets.com/f_webp,dpr_1.5,q_60,w_210,c_limit,fl_progressive/assets/images/22489330/2023/11/8/1206a97c-fb62-4f10-80ce-58c2dd0442371699441789706LevisMenLinenChinoShorts1.jpg',
        'CasualWear',
        'men',
        'Perfect summer wear chino shorts for every casual outing.',
        4.2,
        12,
        29.99,
        15
    ),
    (
        'Pleated Skirt',
        'https://assets.myntassets.com/f_webp,dpr_1.5,q_60,w_210,c_limit,fl_progressive/assets/images/22487808/2023/3/30/8a530695-6d9e-4620-aeb8-8c6a78a1d8741680160510005-WISSTLER-Women-Skirts-651680160509419-1.jpg',
        'TrendSetters',
        'women',
        'A trendy pleated skirt that matches any top.',
        4.7,
        30,
        39.99,
        20
    ),
    (
        'Leather Handbag',
        'https://assets.myntassets.com/f_webp,dpr_1.5,q_60,w_210,c_limit,fl_progressive/assets/images/25169418/2023/11/3/3e008edf-6f18-4d44-9cca-e2ce10080eea1699001654312-Hidesign-Leather-Structured-Sling-Bag-1591699001653942-1.jpg',
        'LuxuryGoods',
        'women',
        'Elegant leather handbag for the fashion-conscious.',
        4.9,
        8,
        120.99,
        5
    ),
    (
        'Kids Denim Overalls',
        'https://assets.myntassets.com/f_webp,dpr_1.5,q_60,w_210,c_limit,fl_progressive/assets/images/25447066/2023/10/11/df0da0a2-c521-4e40-ae32-efab102eed971697026549151BoysYellow-BlueGirrafeMotifPrintedDenimDungareeWithT-shirt1.jpg',
        'MiniMode',
        'kids',
        'Durable denim overalls for kids on the go.',
        4.0,
        50,
        34.99,
        25
    ),
    (
        'Girls Floral Dress',
        'https://assets.myntassets.com/f_webp,dpr_1.5,q_60,w_210,c_limit,fl_progressive/assets/images/21683048/2023/1/24/31cb12f2-22a3-472c-ad3f-c6d1e53b794b1674548777836ANDPinkFloralDress1.jpg',
        'LittleBlossoms',
        'kids',
        'Colorful floral dress perfect for any occasion.',
        4.3,
        15,
        24.99,
        30
    ),
    (
        'Boys Graphic Tee',
        'https://assets.myntassets.com/f_webp,dpr_1.5,q_60,w_210,c_limit,fl_progressive/assets/images/20632966/2022/11/5/deaaf87c-4396-4bd4-bf1d-cbad694b856a1667636010367KinseyBoysDisneyMickeyLongSleeveTshirts1.jpg',
        'KidzStyle',
        'kids',
        'Cool and comfortable graphic tee for everyday play.',
        3.9,
        35,
        14.99,
        40
    ),
    (
        'Women''s Yoga Pants',
        'https://assets.myntassets.com/f_webp,dpr_1.5,q_60,w_210,c_limit,fl_progressive/assets/images/24059134/2023/9/13/e0893bd9-0a8c-4f3b-be2b-3566e1913e6f1694609825826-PUMA-POWER-Womens-Sweatpants-5641694609825263-1.jpg',
        'FitFashion',
        'women',
        'Stretchable yoga pants for fitness enthusiasts.',
        4.8,
        22,
        42.99,
        18
    ),
    (
        'Men''s Running Shoes',
        'https://assets.myntassets.com/f_webp,dpr_1.5,q_60,w_210,c_limit,fl_progressive/assets/images/25256444/2023/10/16/5d4dbbf2-bd27-4871-9bd9-0b9cf8dfb16c1697454179330-Puma-Walter-Running-Shoes-291697454179077-1.jpg',
        'SportsGear',
        'men',
        'Designed for the long-distance runner seeking comfort.',
        4.6,
        18,
        89.99,
        22
    ),
    (
        'Boys Cargo Shorts',
        'https://assets.myntassets.com/f_webp,dpr_1.5,q_60,w_210,c_limit,fl_progressive/assets/images/23482372/2023/6/20/d7711fc7-b89a-451e-9091-df7a54d28c3c1687261100272-My-Milestones-Boys-Cotton-Cargo-Shorts-3681687261099649-1.jpg',
        'ActiveKids',
        'kids',
        'Tough and ready cargo shorts for adventurous kids.',
        4.8,
        12,
        19.99,
        20
    );

-- Alter table users add column gender varchar(10) not null;
-- Alter table orders add column feedbackRating TINYINT;
-- Alter table orders add column feedbackDescription VARCHAR(255);