import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Globe, Bot, Loader, AlertCircle } from 'lucide-react';

import srightImage from '../assets/service/sright.webp';
import sleftImage from '../assets/service/sleft.webp';
import MagicWandIcon from '../components/icons/MagicWandIcon';
import DonateIcon from '../components/icons/DonateIcon';

const servicesData = [
    {
        icon: Globe,
        title: " Development",
        description: "Modern, fast, and responsive websites built from scratch to represent you or your business.",
        image: "/service.webp",
        priceUSD: 20,
        characterImage: srightImage
    },
    {
        icon: Bot,
        title: "Discord Bot Development",
        description: "Custom Discord bots to manage, entertain, and grow your community effectively.",
        image: "/discord1.webp",
        priceUSD: 10,
        characterImage: sleftImage
    }
];

const ServiceCard: React.FC<{ service: typeof servicesData[0]; exchangeRate: number | null; error: string | null; theme: any; bgColor: string; }> = ({ service, exchangeRate, error, theme, bgColor }) => {
    const [currency, setCurrency] = useState<'USD' | 'IDR'>('IDR');

    const PriceDisplay = () => {
        if (exchangeRate === null && !error) {
            return (
                <div className="flex items-center justify-start gap-2 h-8">
                    <Loader size={18} className="animate-spin" />
                    <span className={theme.subtext}>Loading price...</span>
                </div>
            );
        }

        let formattedPrice;
        if (currency === 'USD' || error) {
            formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(service.priceUSD);
        } else if (exchangeRate) {
            const priceIDR = service.priceUSD * exchangeRate;
            formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(priceIDR);
        }

        return <span className={`text-2xl font-bold ${theme.text}`}>{formattedPrice}</span>;
    };

    return (
        <div className={`flex flex-col rounded-2xl border-2 backdrop-blur-sm overflow-hidden ${bgColor} ${theme.borderColor} ${theme.shadow}`}>
            <div className="aspect-video overflow-hidden border-b-2" style={{ borderColor: 'inherit' }}>
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://placehold.co/600x400/8E24AA/FFFFFF?text=Image+Not+Found'} />
            </div>
            <div className="p-8 flex flex-col flex-grow">
                <h3 className={`text-2xl font-bold mb-2 ${theme.text}`}>{service.title}</h3>
                <p className={`mb-6 flex-grow ${theme.subtext}`}>{service.description}</p>

                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className={`text-sm mb-1 ${theme.subtext}`}>Starts from</p>
                        <PriceDisplay />
                    </div>
                    {!error && (
                        <div className={`flex border-2 rounded-lg ${theme.borderColor}`}>
                            <button onClick={() => setCurrency('USD')} className={`px-4 py-2 text-sm font-bold transition-colors ${currency === 'USD' ? (theme.isDark ? 'bg-white text-black' : 'bg-black text-white') : ''}`}>USD</button>
                            <button onClick={() => setCurrency('IDR')} className={`px-4 py-2 text-sm font-bold transition-colors ${currency === 'IDR' ? (theme.isDark ? 'bg-white text-black' : 'bg-black text-white') : ''}`}>IDR</button>
                        </div>
                    )}
                </div>
                {error && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
            </div>
        </div>
    );
};

export const Services: React.FC = () => {
    const { isDarkMode } = useTheme();
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
                if (!response.ok) throw new Error('Network response was not ok.');
                const data = await response.json();
                setExchangeRate(data.usd.idr);
            } catch (err) {
                console.error(err);
                setError('Could not load IDR price.');
                setExchangeRate(16400);
            }
        };
        fetchRate();
    }, []);

    const colors = {
        light: {
            bg: '#E0B0FF', text: 'text-black', subtext: 'text-gray-800',
            cardBg: ['bg-cyan-100/70', 'bg-amber-100/70'],
            shadow: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
            hoverShadow: 'hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
            borderColor: 'border-black', iconFill: '#141212',
            buttonBg: 'bg-green-300', isDark: false
        },
        dark: {
            bg: '#1D0245', text: 'text-white', subtext: 'text-gray-200',
            cardBg: ['bg-cyan-900/70', 'bg-amber-900/70'],
            shadow: 'shadow-[8px_8px_0px_0px_rgba(221,221,255,0.7)]',
            hoverShadow: 'hover:shadow-[4px_4px_0px_0px_rgba(221,221,255,0.7)]',
            borderColor: 'border-gray-400', iconFill: '#F3F4F6',
            buttonBg: 'bg-green-800', isDark: true
        }
    };
    const theme = isDarkMode ? colors.dark : colors.light;

    return (
        <section id="services-teaser" className="relative py-20 px-4 transition-colors duration-500 overflow-hidden" style={{ backgroundColor: theme.bg }}>
            
            {/* Background Icons */}
            <div className={`absolute inset-0 z-0 opacity-10 pointer-events-none ${theme.text}`}>
                <DonateIcon className="absolute top-[10%] left-[10%] w-16 h-16 transform -rotate-12 animate-pulse" />
                <DonateIcon className="absolute top-[20%] right-[15%] w-12 h-12 transform rotate-12" />
                <DonateIcon className="absolute bottom-[15%] left-[20%] w-24 h-24 transform rotate-6 animate-pulse delay-1000" />
                <DonateIcon className="absolute bottom-[10%] right-[10%] w-8 h-8 transform -rotate-6" />
                <DonateIcon className="absolute top-[50%] left-[45%] w-10 h-10 transform rotate-45 animate-pulse delay-500" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <div
                    className="text-center mb-12"
                >
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <MagicWandIcon className="w-10 h-10" fill={theme.iconFill} />
                        <h2 className={`text-4xl md:text-5xl font-bold ${theme.text}`}>What I Offer</h2>
                    </div>
                    <p className={`text-lg md:text-xl ${theme.subtext}`}>
                        I provide high-quality services to bring your ideas to life.
                    </p>
                </div>

                <div className="space-y-12 md:space-y-24 mb-16">
                    {servicesData.map((service, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
                           
                            <div className={`hidden md:flex justify-center items-center ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                                <img 
                                    src={service.characterImage} 
                                    alt="Character illustration" 
                                    className="w-72 lg:w-96 h-auto"
                                    onError={(e) => e.currentTarget.src = 'https://placehold.co/384x384/1D0245/FFFFFF?text=Image+Error'}
                                />
                            </div>

                             <div>
                                 <ServiceCard
                                    service={service}
                                    exchangeRate={exchangeRate}
                                    error={error}
                                    theme={theme}
                                    bgColor={theme.cardBg[index % theme.cardBg.length]}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className="text-center"
                >
                    <Link to="/services/website" className={`inline-block py-4 px-10 border-2 rounded-lg font-semibold text-xl transition-all duration-300 ${theme.buttonBg} ${theme.borderColor} ${theme.text} ${theme.shadow} ${theme.hoverShadow} hover:-translate-y-1 hover:translate-x-1`}>
                        View All Services
                    </Link>
                </div>
            </div>
        </section>
    );
};