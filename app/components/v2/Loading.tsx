import React from 'react';

function Loading() {
    return (
        <div className="flex fixed inset-0 -translate-y-12 items-center justify-center min-h-screen">
            <div className="relative">
                <div className="relative w-12 h-12">
                    <div
                        className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-r-[#FF6B00] border-b-[#FF6B00] animate-spin"
                    ></div>

                    <div
                        className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-t-[#FF6B00] animate-spin"
                    ></div>
                </div>

                <div
                    className="absolute inset-0 bg-gradient-to-tr from-[#FF6B00]/10 via-transparent to-[#FF6B00]/5 animate-pulse rounded-full blur-sm"
                ></div>
            </div>
        </div>

    );
}

export default Loading;