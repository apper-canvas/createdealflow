import React from 'react';

const ContactAvatar = ({ firstName, lastName, size = 16 }) => {
    const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    
    const sizeClasses = {
        12: 'w-8 h-8 text-xs',
        14: 'w-10 h-10 text-sm',
        16: 'w-12 h-12 text-lg',
        20: 'w-16 h-16 text-xl',
    };

    return (
        <div className={`${sizeClasses[size] || 'w-12 h-12 text-lg'} bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center`}>
            <span className="text-white font-semibold">{initials}</span>
        </div>
    );
};

export default ContactAvatar;