const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function createBuildingWithChecklist(buildingData) {
    const {name, location, isActive, checklistItems} = buildingData;

    //transaction
    return prisma.$transaction(async (tx) => {
        //1. create parent building record
        const newBuilding = await tx.building.create({
            data: {
                name,
                location,
                isActive
            },
        });

        //2. prepare checklist items with buildingId
        const newChecklistItems = checklistItems.map(((item) => ({
            ...item,
            buildingId: newBuilding.id,
        })));

        //3. create the associated checklist items with buildingId
        await tx.checklistItem.createMany({
            data: newChecklistItems,
        });

        return newBuilding;
    })
}

async function getBuildingChecklistItems(buildingId) {
    const checklistItems = await prisma.checklistItem.findMany({
        where: {
            buildingId: buildingId
        },
        select: {
            id: true,
            question: true
        }
    });

    return checklistItems;
}

async function getAllBuildings() {
    return prisma.building.findMany({
        select: {
            id: true,
            name: true,
            location: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            checklistItems: {
                select: {
                _count: true
                }
            }
        },
        orderBy: {updatedAt: 'desc'}
    });
}

async function getAllActiveBuildings() {
    return prisma.building.findMany({
        where: {isActive: true},
    });
}

async function getBuildingById(id) {
    return prisma.building.findUnique({
        where: {id: id},
        include: {
            checklistItems: true,
        },
    });
}


async function deleteBuilding(id) {
    //transaction
    return prisma.building.update({
        where: {id: id},
        data: {isActive: false},
    });
}


async function updateBuilding(id, updatedBuildingData) {
    const {name, location, isActive, checklistItems} = updatedBuildingData;

    return prisma.$transaction(async (tx) => {
        //1. update parent building record

        if (name || location) {
            await tx.building.update({
                where: {id: id},
                data: {
                    name,
                    location,
                    isActive,
                },
            });
        }

        //2. handling the checklist items to CREATE
        if (checklistItems?.create?.length > 0) {
            await tx.checklistItem.createMany({
               data: checklistItems.create.map((item) => ({
                   ...item,
                   buildingId: id
               }))
            });
        }

        //3. handling checklist items update case
        if (checklistItems?.update?.length > 0) {
            for (let item of checklistItems.update) {
                await tx.checklistItem.update({
                    where: {id: item.id},
                    data: {
                        question: item.question,
                        type: item.type,
                    },
                });
            }
        }

        //4. handling delete case
        if (checklistItems?.delete?.length > 0) {
            await tx.checklistItem.deleteMany({
                where: {
                    id: {
                        in: checklistItems.delete,
                    }
                }
            })
        }


        //returning the updated building
        return tx.building.findUnique({
            where: {id: id},
            include: {checklistItems: true},
        });

    });
}


async function getAllBuildingIds() {
    const buildings = await prisma.building.findMany({
        select: {id: true}
    });
    return buildings.map(b => b.id);
}

module.exports = {
    createBuildingWithChecklist, getAllBuildings, getBuildingById, deleteBuilding, updateBuilding, getBuildingChecklistItems, getAllActiveBuildings, getAllBuildingIds
}