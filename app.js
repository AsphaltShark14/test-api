// task 1
const products = [];
const carts = [];
const users = [];
    
    fetch("https://fakestoreapi.com/products")
        .then(res => res.json())
        .then(data => products.push(...data))
        .catch(err => console.log(err));
    fetch("https://fakestoreapi.com/carts")
        .then(res => res.json())
        .then(data => carts.push(...data))
        .catch(err => console.log(err));
    fetch("https://fakestoreapi.com/users")
        .then(res => res.json())
        .then(data => users.push(...data))
        .catch(err => console.log(err));
//task 2
const findCategoryValue = () => {
    
    const categoriesWithPrices = products.map(product => {
            return { category: product.category, value: product.price }
        });

    const categoriesWithFullValues = categoriesWithPrices.reduce((sum, value) => {
        const findCategory = sum.find(category => category.category === value.category);

        if (findCategory) {
            findCategory.value += value.value;
        } else {
            sum.push(value);
        }

        return sum;
    }, [])

    return categoriesWithFullValues;
}

// task 3
const getCartValue = (cartProducts) => {
    let cartValue = 0;
    cartProducts.map(cartProduct => {
        const findId = products.find(product => product.id === cartProduct.productId);
        let singleProductPrice = 0;
        if (findId) {
            singleProductPrice = cartProduct.quantity *  findId.price;
            cartValue += singleProductPrice;
        }
    })
    return cartValue;
}

const getHighestCartValue = () => {
    const essentialCartInfo = carts.map(cart => {
        return { userId: cart.userId, value: getCartValue(cart.products) }
    });
    const highestCartValue = essentialCartInfo.reduce((prev, current) => {
        return (prev.value > current.value) ? prev : current;
    });

    return highestCartValue;
}

const capitalizeFirstLetter = (word) => {
    return word[0].toUpperCase() + word.slice(1);
}

const getUserById = (userId) => {
    const findFullName = users.find(user => user.id === userId);
    const { firstname, lastname } = findFullName.name;
    const fullName = `${capitalizeFirstLetter(firstname)} ${capitalizeFirstLetter(lastname)}`;
    return fullName;
}

const getUserWithHighestValueCart = () => {
    const userCart = getHighestCartValue();

    return { fullname: getUserById(userCart.userId), value: userCart.value };
}

// task 4
getDistanceBetweenUsers = () => {
    const degreesToRadians = deg =>  {
        return deg * (Math.PI / 180);
    }
    
    const getDistance = (lat1, long1, lat2, long2) => {
        const R = 6371; //Earth radius
        const degLat = degreesToRadians(lat2 - lat1);
        const degLong = degreesToRadians(long2 - long1);

        const a =
            Math.sin(degLat / 2) * Math.sin(degLat / 2) +
            Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
            Math.sin(degLong / 2) * Math.sin(degLong / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return d = R * c; //Distance in kilometers
    }

    const distancesArray = [];
    let highestDistanceValue = 0;
    const comparedUsers = [];
    const calculateDistance = users.map(comparedUser => {
        users.map(otherUser => {
            if (comparedUser.id === otherUser.id) return;
            const distance = getDistance(
                comparedUser.address.geolocation.lat,
                comparedUser.address.geolocation.long,
                otherUser.address.geolocation.lat,
                otherUser.address.geolocation.long
            )
            distancesArray.push({comparedUser: comparedUser.id, otherUserId: otherUser.id, distance});
            if(distance>highestDistanceValue) {
                highestDistanceValue = distance;
                comparedUsers[0] = getUserById(comparedUser.id);
                comparedUsers[1] = getUserById(otherUser.id);
                };
        }
        )
    })

    return {distance: highestDistanceValue, comparedUsers};

}