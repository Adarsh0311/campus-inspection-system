const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function createDataCategory(categoryData) {
    const {name, type, position} = categoryData;

    const data = await prisma.dataCategory.create({
        data: {
            name,
            type,
            position
        },
    });

    return data;
}

async function getAllDataCategories() {
    return prisma.dataCategory.findMany({});
}

async function getDataCategoryById(id) {
    return prisma.dataCategory.findUnique({
        where: {id: id},
    });
}

async function deleteDataCategory(id) {
    const data = await prisma.dataCategory.delete({
        where: {id: id},
    });

    return data;
}

module.exports = {createDataCategory, getAllDataCategories, getDataCategoryById, deleteDataCategory};