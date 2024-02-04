import { prisma } from "../src/lib/prisma";
import books from "./data/books.json";
import stock from "./data/stock.json";

const bookMap = new Map();

for (const book of books) {
  bookMap.set(book.isbn, book);
}

for (const stockItem of stock) {
  const book = bookMap.get(stockItem.isbn);
  const publishedYear = new Date();
  publishedYear.setFullYear(book.publishedYear || 2024, 1, 1);
  if (book) {
    book.stock = stockItem;
    book.title = stockItem.title;
    book.publishedYear = publishedYear.toISOString();
  }
  bookMap.set(stockItem.isbn, book);
}

async function seed() {
  const college = await prisma.college.findFirstOrThrow();
  await Promise.all(
    Array.from(bookMap.values()).map(async (book, idx) => {
      await prisma.resource.create({
        data: {
          ...book,
          stock: {
            connectOrCreate: {
              create: {
                libLocation: `sci/${idx + 1}`,
                quantity: book.stock.quantity,
                collegeId: college.id,
              },
              where: {
                id: college.id,
              },
            },
          },
        },
      });
    })
  );
}

seed()
  .then(() => console.log("Seed Complete"))
  .catch((error) => console.log("Error seeding database.", error))
  .finally(() => process.exit(0));
