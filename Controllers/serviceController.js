const Service = require("../Models/services");
const mongoose = require("mongoose");

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
 *                 service:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '500':
 *         description: Internal Server Error - Failed to create the service
 */

exports.CreateService = async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price)
    return res.status(400).json({ msg: "Preencha todos os campos" });

  const response = await Service.create({
    name,
    price,
  });

  res.json({ status: "success", Service: response });
};

/**
 * @swagger
 * /EditService/{id}:
 *   put:
 *     summary: Edit a service
 *     description: Endpoint to edit an existing service.
 *     tags:
 *       - Services
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the service to edit
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Service editing data
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
 *         description: Service edited successfully
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
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     updatedAt:
 *                       type: string
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '404':
 *         description: Not Found - Service not found
 *       '500':
 *         description: Internal Server Error - Failed to edit the service
 */

exports.EditService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    // Verifica se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID de serviço inválido" });
    }

    // Atualiza o serviço pelo ID
    const updatedService = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // Verifica se o serviço foi encontrado e atualizado
    if (!updatedService) {
      return res.status(404).json({ msg: "Serviço não encontrado" });
    }

    // Responde com sucesso e os detalhes do serviço atualizado
    res.json({ status: "success", service: updatedService });
  } catch (error) {
    console.error("Erro ao atualizar o serviço:", error);
    res.status(500).json({ msg: "Erro interno do servidor" });
  }
};

/**
 * @swagger
 * /RemoveService/{id}:
 *   delete:
 *     summary: Remove a service
 *     description: Endpoint to remove an existing service.
 *     tags:
 *       - Services
 *     parameters:
 *       - name: id
 *         in: path
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
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *       '400':
 *         description: Bad Request - Invalid service ID
 *       '404':
 *         description: Not Found - Service not found
 *       '500':
 *         description: Internal Server Error - Failed to remove the service
 */

exports.RemoveService = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "Invalid service ID" });
  }

  const service = await Service.findById(id);

  if (!service) {
    return res.status(404).json({ msg: "Service not found" });
  }

  await Service.deleteOne(service);

  res.json({ status: "success", service: service });
};

/**
 * @swagger
 * /ReadService/{id}:
 *   get:
 *     summary: Get service information
 *     description: Endpoint to retrieve information for an existing service.
 *     tags:
 *       - Services
 *     parameters:
 *       - name: id
 *         in: path
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
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *       '400':
 *         description: Bad Request - Invalid service ID
 *       '404':
 *         description: Not Found - Service not found
 *       '500':
 *         description: Internal Server Error - Failed to retrieve service information
 */

exports.ReadService = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "Invalid service ID" });
  }

  const service = await Service.findById(id);
  if (!service) {
    return res.status(404).json({ msg: "Service not found" });
  }

  res.json({ status: "success", service: service });
};

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
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *       '500':
 *         description: Internal Server Error - Failed to retrieve services
 */

exports.ReadServices = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || Number.MAX_SAFE_INTEGER;
  const startIndex = (page - 1) * limit;

  try {
    const services = await Service.find().skip(startIndex).limit(limit);
    const totalServices = await Service.countDocuments();

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalServices / limit),
      totalServices: totalServices,
    };

    res.json({ status: "success", services: services, pagination: pagination });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};


/**
 * @swagger
 * /CountServices:
 *   get:
 *     summary: Count all services
 *     description: Endpoint to count all existing services.
 *     tags:
 *       - Services
 *     responses:
 *       '200':
 *         description: Service count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 serviceCount:
 *                   type: number
 *       '500':
 *         description: Internal Server Error - Failed to count services
 */

exports.CountServices = async (req, res) => {
  try {
    const totalServices = await Service.countDocuments();
    res.status(200).json({ serviceCount: totalServices });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, message: "Error counting services", data: {} });
  }
};
