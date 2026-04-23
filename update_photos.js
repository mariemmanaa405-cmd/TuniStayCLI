const fs = require('fs');

const hotelPhotos = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800',
  'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?q=80&w=800',
  'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=800',
  'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=800',
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800'
];

const restaurantPhotos = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800',
  'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=800',
  'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800',
  'https://images.unsplash.com/photo-1550966842-28af2616881c?q=80&w=800',
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800',
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800',
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800',
  'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=800'
];

const eventPhotos = [
  'https://images.unsplash.com/photo-1543734412-104558acc7da?q=80&w=800',
  'https://images.unsplash.com/photo-1514525253361-bee87382061e?q=80&w=800',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800',
  'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=800',
  'https://images.unsplash.com/photo-1511192303578-4a7ec982c9ca?q=80&w=800',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800',
  'https://images.unsplash.com/photo-1514119412350-e174d90d280e?q=80&w=800',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800',
  'https://images.unsplash.com/photo-1509059852496-f3822ae057bf?q=80&w=800',
  'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=800'
];

function updateFile(filename, photosArr) {
  const data = JSON.parse(fs.readFileSync(filename, "utf8"));
  data.forEach((item, index) => {
    item.photos = [photosArr[index % photosArr.length]];
  });
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

updateFile("src/data/hotels.json", hotelPhotos);
updateFile("src/data/restaurants.json", restaurantPhotos);
updateFile("src/data/events.json", eventPhotos);
console.log("All data photos updated successfully.");
