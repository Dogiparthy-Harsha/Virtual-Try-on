import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import Button from './components/Button';
import { UploadedImage, GenerationStatus } from './types';
import { generateTryOnImage } from './services/geminiService';

const App: React.FC = () => {
  const [modelImage, setModelImage] = useState<UploadedImage | null>(null);
  const [garmentImage, setGarmentImage] = useState<UploadedImage | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!modelImage || !garmentImage) return;

    setStatus(GenerationStatus.LOADING);
    setErrorMessage(null);
    setResultImage(null);

    try {
      const generatedImageBase64 = await generateTryOnImage(modelImage, garmentImage);
      setResultImage(generatedImageBase64);
      setStatus(GenerationStatus.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setStatus(GenerationStatus.ERROR);
      setErrorMessage(error.message || "Failed to generate image. Please try again.");
    }
  };

  const handleReset = () => {
    setModelImage(null);
    setGarmentImage(null);
    setResultImage(null);
    setStatus(GenerationStatus.IDLE);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-tr from-purple-500 to-indigo-500 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-white">Luxe<span className="text-purple-400">Fit</span> AI</span>
            </div>
            <div className="text-sm text-gray-400 hidden sm:block">
              Virtual Try-On Powered by Gemini
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Intro Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Reimagine Your Wardrobe
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Upload a photo of yourself and a garment you love. Our AI will seamlessly blend them to show you the perfect fit in seconds.
          </p>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Input Column */}
          <div className="lg:col-span-5 space-y-8">
             <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/50 shadow-xl backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold mr-3">1</span>
                  Upload Assets
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <ImageUpload 
                    label="The Model" 
                    image={modelImage} 
                    onImageChange={setModelImage} 
                    placeholderText="Upload person"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  />
                  <ImageUpload 
                    label="The Garment" 
                    image={garmentImage} 
                    onImageChange={setGarmentImage} 
                    placeholderText="Upload clothes"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    }
                  />
                </div>

                <div className="mt-8">
                  <Button 
                    onClick={handleGenerate} 
                    disabled={!modelImage || !garmentImage} 
                    isLoading={status === GenerationStatus.LOADING}
                    className="w-full"
                  >
                    Generate Look
                  </Button>
                  {errorMessage && (
                    <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-sm">
                      {errorMessage}
                    </div>
                  )}
                </div>
             </div>

             <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-4 flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-300">
                  For best results, use a full-body photo of the model and a garment image on a plain background.
                </p>
             </div>
          </div>

          {/* Arrow Divider (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-1 items-center justify-center h-full pt-32 text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
             </svg>
          </div>

          {/* Output Column */}
          <div className="lg:col-span-6">
            <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/50 shadow-xl backdrop-blur-sm min-h-[600px] flex flex-col">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-bold mr-3">2</span>
                    Virtual Try-On Result
                  </h2>
                  {resultImage && (
                    <button 
                      onClick={handleReset} 
                      className="text-sm text-gray-400 hover:text-white underline"
                    >
                      Start Over
                    </button>
                  )}
               </div>

               <div className="flex-grow flex items-center justify-center bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-700 relative overflow-hidden group">
                  
                  {status === GenerationStatus.LOADING ? (
                     <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                           <div className="absolute inset-0 border-t-4 border-purple-500 rounded-full animate-spin"></div>
                           <div className="absolute inset-2 border-r-4 border-indigo-500 rounded-full animate-spin-slow"></div>
                        </div>
                        <h3 className="text-xl font-semibold text-white animate-pulse">Generating your look...</h3>
                        <p className="text-gray-400 mt-2">Analyzing fabric drape and lighting.</p>
                     </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                      <img 
                        src={resultImage} 
                        alt="Generated Try-On" 
                        className="max-w-full max-h-[700px] object-contain shadow-2xl" 
                      />
                      <a 
                        href={resultImage} 
                        download="luxefit-tryon.png"
                        className="absolute bottom-6 right-6 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0"
                      >
                        Download Image
                      </a>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                       <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                       </div>
                       <p className="text-gray-500 text-lg">Your generated masterpiece will appear here.</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} LuxeFit AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;