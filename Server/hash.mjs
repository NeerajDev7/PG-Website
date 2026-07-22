import bcrypt from 'bcryptjs';

const password = 'tenant123';
const hash = await bcrypt.hash(password,10);
console.log(hash);