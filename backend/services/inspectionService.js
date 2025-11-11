const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Submit a new inspection with associated answers.
 * @param inspectionData
 * @returns {Promise<Promise<Prisma.Prisma__InspectionClient<GetResult<Prisma.$InspectionPayload<DefaultArgs>, {data: {userId: *, buildingId: *, date: *}}, "create", Prisma.PrismaClientOptions>, never, DefaultArgs, Prisma.PrismaClientOptions>> & {}>}
 */
async function submitInspection(inspectionData) {
    try {
         return await createInspection(inspectionData)
    } catch (e) {
        console.error(e);
    }

}

function toUTCDateOnly(dateStr) {
    const d = new Date(dateStr);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}


/**
 * Get inspection history for a building within a date range.
 * @param buildingId
 * @param startDate
 * @param endDate
 * @returns {Promise<GetFindResult<Prisma.$InspectionPayload<DefaultArgs>, {where: {buildingId: *, date: {gte: *, lte: *}}, include: {inspectionAnswers: boolean}}, Prisma.PrismaClientOptions>[]>}
 */
async function getInspectionHistoryByBuildingAndDateRange(buildingId, startDate, endDate) {
    const sDate = startDate ? toUTCDateOnly(startDate) : undefined;
    const eDate = endDate ? toUTCDateOnly(endDate) : undefined;

    const dateFilter = {};
    if (sDate && eDate) {
        dateFilter.lte = sDate;
        dateFilter.gte = eDate;
    } else if (sDate) {
        dateFilter.lte = sDate;
    } else if (eDate) {
        dateFilter.gte = eDate;
    }

    const inspections = await prisma.inspection.findMany({
        where: {
            buildingId,
            ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
        },
        select: {
            id: true,
            userId: true,
            buildingId: true,
            date: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true
                }
            },
            answers: {
                select: {
                    checklistItem: {
                        select: {
                            question: true
                        }
                    },
                    textAnswer: true
                }
            }
        }
    });


    const formatedInspections = inspections.map( inspection => {
        const formatedAnswers =  inspection.answers.map(answer => {

            //defining new structure for answers
            return {
                question: answer.checklistItem.question,
                textAnswer: answer.textAnswer
            };
        });

        //format user name
        const name = `${inspection.user.firstName} ${inspection.user.lastName}`;


        return {
            ...inspection,
            user: name,
            date: inspection.date.toISOString().slice(0, 10), // show YYYY-MM-DD only
            answers: formatedAnswers
        }
    });


    return formatedInspections;
}


async function getInspectionById(inspectionId) {
    const inspection = await prisma.inspection.findUnique({
        where: {
            id: inspectionId
        },
        select: {
            id: true,
            userId: true,
            buildingId: true,
            date: true,
            building: {
                select: {
                    name: true,
                }
            },
            user: {
                select: {
                    firstName: true,
                    lastName: true
                }
            },
            answers: {
                select: {
                    checklistItem: {
                        select: {
                            question: true
                        }
                    },
                    textAnswer: true
                }
            }
        }
    });

    const formatedAnswers =  inspection.answers.map(answer => {

        //defining new structure for answers
        return {
            question: answer.checklistItem.question,
            textAnswer: answer.textAnswer
        };
    });

    //format user name
    const name = `${inspection.user.firstName} ${inspection.user.lastName}`;

    return {
        ...inspection,
        user: name,
        answers: formatedAnswers
    }

}

/**
 * Get inspections for a user in a specific building.
 * @param userId
 * @param buildingId
 * @returns {PrismaPromise<GetFindResult<Prisma.$InspectionPayload<DefaultArgs>, {where: {userId: *, buildingId: *}, include: {inspectionAnswers: boolean}}, Prisma.PrismaClientOptions>[]>}
 */
async function getBuildingInspectionsByUserId(userId, buildingId) {
    return prisma.inspection.findMany({
        where: {
            userId: userId,
            buildingId: buildingId
        },
        include: {
            answers: true
        }
    });
}

async function createInspection( inspectionData) {
    //start transaction
    return prisma.$transaction(async (prisma) => {
        // Create the inspection record
        const newInspection = await prisma.inspection.create({
            data: {
                userId: inspectionData.userId,
                buildingId: inspectionData.buildingId,
                date: inspectionData.date,
            }
        });

        // Create associated inspection items
        const inspectionAnswers = inspectionData.answers.map(item => ({
            inspectionId: newInspection.id,
            textAnswer: item.answer,
            checklistItemId: item.questionId,
        }));

        await prisma.inspectionAnswer.createMany({
            data: inspectionAnswers
        });

        return newInspection;
    });
}


module.exports = { submitInspection, getInspectionHistoryByBuildingAndDateRange, getBuildingInspectionsByUserId, getInspectionById };