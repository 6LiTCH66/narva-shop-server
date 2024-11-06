import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';
import axios from "axios"
import * as dotenv from "dotenv"
import * as process from "process";


dotenv.config()

const prisma = new PrismaClient();
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;


enum Size {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL',
}
const sizeValues = Object.values(Size);

async function fetchFashionImagesAndNames(count = 1) {
  try {
    const response = await axios.get(`https://api.unsplash.com/photos/random`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        count: count,
        query: 'clothing Clothe',
      },
    });

    // return response.data.map((photo) => photo.urls.regular);
    const clothImg = response.data[0].urls.regular
    const clothName = response.data[0].alt_description

    return {
      img: clothImg,
      name: clothName,
    }

  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    return {
      img: null,
      name: null,
    };
  }
}

async function main(){

  for (let i = 0; i < 20; i++) {
    const imageAndName = await fetchFashionImagesAndNames()
    const randomLength = faker.number.int({ min: 2, max: 7 });

    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        image: imageAndName.img,
        price: faker.number.float({min: 10, max: 200, fractionDigits: 2}),
        quantity: faker.number.int({min: 5, max: 30}),
        size: faker.helpers.arrayElements(sizeValues, randomLength)
      }
    })
  }

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })





