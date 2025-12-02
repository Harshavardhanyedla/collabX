import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ResourcesSection: React.FC = () => {
    const navigate = useNavigate();

    const resources = [
        {
            id: 'cat',
            title: 'CAT Resources',
            description: 'Comprehensive study materials, mock tests, and guides for Common Admission Test preparation.',
            icon: '📊',
            color: 'badge-blue'
        },
        {
            id: 'upsc',
            title: 'UPSC Resources',
            description: 'Curated notes, current affairs, and syllabus breakdowns for Civil Services Examination.',
            icon: '🏛️',
            color: 'badge-yellow'
        },
        {
            id: 'gate',
            title: 'GATE Resources',
            description: 'Subject-wise notes, previous year questions, and technical resources for Graduate Aptitude Test in Engineering.',
            icon: '⚙️',
            color: 'badge-green'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <section id="resources" className="section-padding relative z-10 min-h-[80vh] flex flex-col justify-center">
            <div className="container-custom">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
                        Student Resources
                    </h2>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light">
                        Curated study materials and exam preparation guides to help you excel in your academic journey.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {resources.map((resource) => (
                        <motion.div
                            key={resource.id}
                            className="glass-card flex flex-col h-full p-8 cursor-pointer group"
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.03,
                                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)"
                            }}
                            onClick={() => navigate(`/resources/${resource.id}`)}
                        >
                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center text-4xl border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                    {resource.icon}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-blue-600 transition-colors">
                                {resource.title}
                            </h3>

                            <p className="text-gray-600 mb-6 leading-relaxed text-center font-light flex-1">
                                {resource.description}
                            </p>

                            <div className="mt-auto text-center">
                                <span className="text-blue-300 font-medium group-hover:underline underline-offset-4 flex items-center justify-center gap-2">
                                    View Materials <span>→</span>
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ResourcesSection;
