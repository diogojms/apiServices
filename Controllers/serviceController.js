const Service = require('../Models/services');
const Services = require('../Models/services');
const mongoose = require('mongoose');

/**
 * @swagger
 * /CreateService:
 *   post:
 *     summary: Create a new service
 *     description: Endpoint to create a new service.
 *     tags:
 *       - Services
 *     requestBody:
 *       description: Service creation data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *             required:
 *               - name
 *               - price
 *     responses:
 *       '200':
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 Services:
 *                   type: object
 *                   // Define your service properties here
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '500':
 *         description: Internal Server Error - Failed to create the service
 */
exports.CreateService = async (req, res) => {
    const {name, price} = req.body

    if(!name || !price)
        return res.status(400).json({msg: 'Preencha todos os campos'})

    const response = await Services.create({
        name,
        price
    })

    res.json({status:'success', Services: response})
}

/**
 * @swagger
 * /EditServiceName/:
 *   put:
 *     summary: Edit the name of a service
 *     description: Endpoint to edit the name of an existing service.
 *     tags:
 *       - Services
 *     parameters:
 *       - name: id
 *         in: query
 *         description: ID of the service to edit the name
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Service name editing data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newName:
 *                 type: string
 *             required:
 *               - newName
 *     responses:
 *       '200':
 *         description: Service name edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 Service:
 *                   type: object
 *                   // Define your service properties here
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '404':
 *         description: Not Found - Service not found
 *       '500':
 *         description: Internal Server Error - Failed to edit the service name
 */
exports.EditServiceName = async (req, res) => {
    try {
        const { newName } = req.body;
        const { id } = req.query;

        // Verifica se o ID é válido
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ msg: 'ID de serviço inválido' });
        }

        // Verifica se o campo 'name' está presente
        if (!newName) {
            return res.status(400).json({ msg: 'O campo "name" é obrigatório' });
        }

        // Atualiza o serviço pelo ID
        const updatedService = await Services.findByIdAndUpdate(id, { name: newName }, { new: true });

        // Verifica se o serviço foi encontrado e atualizado
        if (!updatedService) {
            return res.status(404).json({ msg: 'Serviço não encontrado' });
        }

        // Responde com sucesso e os detalhes do servio atualizado
        res.json({ status: 'success', Service: updatedService });
    } catch (error) {
        console.error('Erro ao atualizar o serviço:', error);
        res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

/**
 * @swagger
 * /EditServicePrice/:
 *   put:
 *     summary: Edit the price of a service
 *     description: Endpoint to edit the price of an existing service.
 *     tags:
 *       - Services
 *     parameters:
 *       - name: serviceID
 *         in: query
 *         description: ID of the service to edit the price
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Service price editing data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPrice:
 *                 type: number
 *             required:
 *               - newPrice
 *     responses:
 *       '200':
 *         description: Service price edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 service:
 *                   type: object
 *                   // Define your service properties here
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '404':
 *         description: Not Found - Service not found
 *       '500':
 *         description: Internal Server Error - Failed to edit the service price
 */
exports.EditServicePrice = async (req, res) => {
    try {
        const { newPrice } = req.body;
        const { serviceID } = req.query;

        // Verifica se o ID do serviço é válido
        if (!serviceID || !newPrice){
            return res.status(400).json({ msg: 'ID de serviço ou novo preço inválido' });
        }

        const service = await Services.findById(serviceID);
        if (!service) {
            return res.status(404).json({ msg: 'Serviço não encontrado' });
        }

        // Atualiza o preço do serviço pelo ID

        const updatedService = await Services.findByIdAndUpdate(serviceID, { price:newPrice }, { new: true });

        res.json({ status: 'success', product: updatedService });
    } catch (error) {
        console.error('Erro ao atualizar o preço do serviço:', error);
        res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

/**
 * @swagger
 * /RemoveService/:
 *   delete:
 *     summary: Remove a service
 *     description: Endpoint to remove an existing service.
 *     tags:
 *       - Services
 *     parameters:
 *       - name: serviceID
 *         in: query
 *         description: ID of the service to remove
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Service removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 service:
 *                   type: object
 *                   // Define your service properties here
 *       '400':
 *         description: Bad Request - Invalid service ID
 *       '404':
 *         description: Not Found - Service not found
 *       '500':
 *         description: Internal Server Error - Failed to remove the service
 */
exports.RemoveService = async (req, res) => {
    const { serviceID } = req.query;

    if (!serviceID) {
        return res.status(400).json({ msg: 'Invalid service ID' });
    }

    const service = await Services.findById(serviceID);

    if (!service) {
        return res.status(404).json({ msg: 'Service not found' });
    }

    await Services.deleteOne(service);

    res.json({ status: 'success', service: service});
}

/**
 * @swagger
 * /ReadService/:
 *   get:
 *     summary: Get service information
 *     description: Endpoint to retrieve information for an existing service.
 *     tags:
 *       - Services
 *     parameters:
 *       - name: serviceID
 *         in: query
 *         description: ID of the service to retrieve information
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Service information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 service:
 *                   type: object
 *                   // Define your service properties here
 *       '400':
 *         description: Bad Request - Invalid service ID
 *       '404':
 *         description: Not Found - Service not found
 *       '500':
 *         description: Internal Server Error - Failed to retrieve service information
 */
exports.ReadService = async (req, res) => {
    const { serviceID } = req.query;

    if (!serviceID) {
        return res.status(400).json({ msg: 'Invalid service ID' });
    }

    const service = await Services.findById(serviceID);
    if (!service) {
        return res.status(404).json({ msg: 'Service not found' });
    }

    res.json({ status: 'success', service: service})
}

/**
 * @swagger
 * /ReadServices:
 *   get:
 *     summary: Get all services
 *     description: Endpoint to retrieve information for all existing services.
 *     tags:
 *       - Services
 *     responses:
 *       '200':
 *         description: All services retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 services:
 *                   type: array
 *                   items:
 *                     type: object
 *                     // Define your service properties here
 *       '500':
 *         description: Internal Server Error - Failed to retrieve services
 */
exports.ReadServices = async (req, res) => {
    const services = await Services.find();
    res.json({ status: 'success', services: services })
}
