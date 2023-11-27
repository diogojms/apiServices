const Service = require('../Models/services');
const Services = require('../Models/services');
const mongoose = require('mongoose');

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

exports.ReadServices = async (req, res) => {
    const services = await Services.find();
    res.json({ status: 'success', services: services })
}
