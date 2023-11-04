CREATE TABLE
    Users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        isAdmin TINYINT NOT NULL DEFAULT 0,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
        paymentMethod VARCHAR(255) NOT NULL,
        itemsPrice DECIMAL(19, 4) NOT NULL DEFAULT 0.0,
        taxPrice DECIMAL(19, 4) NOT NULL DEFAULT 0.0,
        shippingPrice DECIMAL(19, 4) NOT NULL DEFAULT 0.0,
        totalPrice DECIMAL(19, 4) NOT NULL DEFAULT 0.0,
        isPaid TINYINT NOT NULL DEFAULT 0,
        paidAt TIMESTAMP NULL,
        isDelivered TINYINT NOT NULL DEFAULT 0,
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