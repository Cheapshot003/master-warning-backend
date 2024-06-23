function addDevice() {
    const deviceName = (document.getElementById('device-name')).value;
    if (deviceName) {
        // Logic to add the device to the list goes here
        console.log(`Device added: ${deviceName}`);
        // Close the modal
        document.getElementById('modal')?.classList.add('hidden');
    } else {
        alert("Please enter a device name");
    }
}