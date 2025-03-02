import React, { useState } from 'react';
import { Download, Share2, Save } from 'lucide-react';
import { CompanyData } from '../types';
import { generateComparisonReport, generateChartImage } from '../utils/reportGenerator';

interface ReportButtonProps {
  companyData: CompanyData;
  competitorData: CompanyData | null;
  targetElementId: string;
  type?: 'fullReport' | 'chartOnly';
  buttonText?: string;
  buttonClassName?: string;
  iconClassName?: string;
  iconSize?: number;
}

const ReportButton: React.FC<ReportButtonProps> = ({
  companyData,
  competitorData,
  targetElementId,
  type = 'fullReport',
  buttonText,
  buttonClassName = '',
  iconClassName = '',
  iconSize = 16
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleDownloadClick = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      if (type === 'fullReport') {
        await generateComparisonReport(companyData, competitorData, targetElementId);
      } else {
        // Download chart as image
        const imageUrl = await generateChartImage(targetElementId);
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${companyData.company.name}_Chart.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareClick = async () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareViaLink = async () => {
    try {
      setIsGenerating(true);
      const imageUrl = await generateChartImage(targetElementId);
      
      // Create a shareable link from the image URL
      // Note: In a real application, you would likely upload this to a server and get a shareable URL
      // For demo purposes, we're just copying the data URL to clipboard
      await navigator.clipboard.writeText(imageUrl);
      alert('Image URL copied to clipboard!');
      setShowShareOptions(false);
    } catch (err) {
      console.error('Error sharing:', err);
      setError('Failed to share. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveImage = async () => {
    try {
      setIsGenerating(true);
      const imageUrl = await generateChartImage(targetElementId);
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${companyData.company.name}_Chart.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowShareOptions(false);
    } catch (err) {
      console.error('Error saving image:', err);
      setError('Failed to save image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative">
      {type === 'fullReport' ? (
        <button
          onClick={handleDownloadClick}
          disabled={isGenerating}
          className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${buttonClassName}`}
        >
          {isGenerating ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Download size={iconSize} className={`mr-2 ${iconClassName}`} />
          )}
          {buttonText || 'Download Report'}
        </button>
      ) : (
        <div className="flex space-x-2">
          <button
            onClick={handleDownloadClick}
            disabled={isGenerating}
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${buttonClassName}`}
            title="Download Chart"
          >
            {isGenerating ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Save size={iconSize - 2} className={iconClassName} />
            )}
          </button>
          
          <button
            onClick={handleShareClick}
            disabled={isGenerating}
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${buttonClassName}`}
            title="Share Chart"
          >
            <Share2 size={iconSize - 2} className={iconClassName} />
          </button>
        </div>
      )}
      
      {showShareOptions && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <button
              onClick={shareViaLink}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Copy Image Link
            </button>
            <button
              onClick={handleSaveImage}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Save as Image
            </button>
          </div>
        </div>
      )}
      
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ReportButton;