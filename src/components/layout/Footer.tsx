import React from "react";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white pt-12 pb-10 px-6 border-t border-green-800">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 md:gap-8 text-center md:text-left">
          
          {/* LEFT: Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full overflow-hidden bg-white border-2 border-green-600 shadow-sm shrink-0">
                 <Image 
                   src="/images/navbar/logo.png" 
                   alt="MatchaRoommate Logo" 
                   width={40} 
                   height={40} 
                   className="w-full h-full object-cover"
                 />
               </div>
               <span className="font-bold text-xl tracking-tight text-white">MatchaRoommate</span>
            </div>
            <p className="text-green-100 text-sm max-w-xs leading-relaxed mx-auto md:mx-0">
              The safest way to find housing and roommates near Visayas State University.
            </p>
            <p className="text-green-200/60 text-xs pt-2">
              © {new Date().getFullYear()} MatchaRoommate. All rights reserved.
            </p>
          </div>

          {/* RIGHT: Contact Info */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="font-bold text-green-100 text-sm uppercase tracking-wider">Contact Us</h3>
            <div className="space-y-3">
              <a href="mailto:support@matcharoommate.com" className="flex items-center gap-3 text-green-100 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-green-800/50 flex items-center justify-center group-hover:bg-green-600 transition-colors border border-green-600/30 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">support@matcharoommate.com</span>
              </a>
              
              <a href="tel:+639123456789" className="flex items-center gap-3 text-green-100 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-green-800/50 flex items-center justify-center group-hover:bg-green-600 transition-colors border border-green-600/30 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">+63 912 345 6789</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}