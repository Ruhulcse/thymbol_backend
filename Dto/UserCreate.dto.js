const { IsEmail, IsNotEmpty, Length, IsString, IsDate, IsIn, IsOptional } = require('class-validator');

class UserCreateDto {
    constructor(googleId, displayName, image, firstName, lastName,
        phoneNumber, password, dateOfBirth, address, postalCode, nid,
        passport, agent_code, userType, userStatus, email) {
        this.googleId = googleId;
        this.displayName = displayName;
        this.image = image;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.postalCode = postalCode;
        this.nid = nid;
        this.passport = passport;
        this.agent_code = agent_code;
        this.userType = userType;
        this.userStatus = userStatus;
        this.email = email;
        this.password = password;
    }
}

IsOptional()(UserCreateDto.prototype, 'googleId');
IsString()(UserCreateDto.prototype, 'googleId');

IsOptional()(UserCreateDto.prototype, 'displayName');
IsString()(UserCreateDto.prototype, 'displayName');

IsOptional()(UserCreateDto.prototype, 'image');
IsString()(UserCreateDto.prototype, 'image');

IsNotEmpty()(UserCreateDto.prototype, 'firstName');
Length(1, 50)(UserCreateDto.prototype, 'firstName');

IsString()(UserCreateDto.prototype, 'firstName');
IsNotEmpty()(UserCreateDto.prototype, 'lastName');
Length(1, 50)(UserCreateDto.prototype, 'lastName');
IsString()(UserCreateDto.prototype, 'lastName');

IsOptional()(UserCreateDto.prototype, 'phoneNumber');
Length(1, 20)(UserCreateDto.prototype, 'phoneNumber');
IsString()(UserCreateDto.prototype, 'phoneNumber');

IsString()(UserCreateDto.prototype, 'password');

IsOptional()(UserCreateDto.prototype, 'dateOfBirth');
IsDate()(UserCreateDto.prototype, 'dateOfBirth');

IsOptional()(UserCreateDto.prototype, 'address');
IsString()(UserCreateDto.prototype, 'address');

IsOptional()(UserCreateDto.prototype, 'postalCode');
IsString()(UserCreateDto.prototype, 'postalCode');

IsOptional()(UserCreateDto.prototype, 'nid');
IsString()(UserCreateDto.prototype, 'nid');

IsOptional()(UserCreateDto.prototype, 'passport');
IsString()(UserCreateDto.prototype, 'passport');

IsOptional()(UserCreateDto.prototype, 'agent_code');
IsString()(UserCreateDto.prototype, 'agent_code');

IsString({ message: 'userType must be a string' })(UserCreateDto.prototype, 'userType');
IsIn(['supperadmin', 'admin', 'user', 'guest', 'carrier', 'shipper', 'broker', 'agent'], { message: 'userType must be one of the defined values' })(UserCreateDto.prototype, 'userType');
IsString()(UserCreateDto.prototype, 'userStatus');
IsIn([
    "Pending",
    "Active",
    "Deactivated",
    "Suspended",
    "Rejected",
    "Blocked",
],{ message: 'userStatus must be one of the defined values' })( UserCreateDto.prototype, 'userStatus')
IsEmail()(UserCreateDto.prototype, 'email');
IsNotEmpty()(UserCreateDto.prototype, 'password');
Length(6, 20)(UserCreateDto.prototype, 'password');

module.exports = UserCreateDto;