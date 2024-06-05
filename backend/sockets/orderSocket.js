module.exports = (io) => {
    return io.on('connection', socket => {
        socket.join('order');
        socket.join(socket.request.user.id);
        socket.join(socket.request.user.role === 'staff' ? socket.request.user.position : socket.request.user.role);

        socket.on('order:create', (orderId) => {
            socket.to(['superuser', 'admin', 'waiter', 'cook']).emit('order:create', orderId);
        })

        socket.on('order:update', (orderId) => {
            socket.to(['superuser', 'admin', 'waiter', 'cook']).emit('order:update', orderId);
        })

        socket.on('order:cancel', (orderId) => {
            socket.to(['superuser', 'admin', 'waiter', 'cook']).emit('order:cancel', orderId);
        })

        socket.on('order:complete', (orderId) => {
            socket.to(['superuser','admin', 'waiter', 'cook', 'accountant']).emit('order:complete', orderId);
            socket.to(['superuser', 'admin', 'accountant']).emit('bill:create', orderId);
        })

        socket.on('bill:settle', (billId) => {
            socket.to(['superuser', 'admin', 'accountant']).emit('bill:settle', billId);
        })

        socket.on('disconnect', () => {})
    })
}