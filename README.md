SimpleFinder
Professional Subdomain Enumeration Tool
A powerful, accessible, production-ready subdomain enumeration utility built for cybersecurity researchers, ethical hackers, and bug bounty hunters. SimpleFinder provides multi-source scanning, DNS brute forcing, and high-performance parallel enumeration with clean CLI output. Works on PC and Termux.
🚀 Features
✨ Core Functionality
Multi-Source Enumeration: crt.sh, Hackertarget, ThreatCrowd APIs
DNS Brute Force: Smart wordlist-based scanning
Parallel Processing: 50+ threads on PC, 15+ on Termux
Beautiful CLI: Color-coded output with ASCII art
Multiple Outputs: TXT and JSON formats
Cross-Platform: Windows, Linux, macOS, Termux
Auto-Save Results: Timestamped output files
🛠️ Technical Features
Python 3.7+ support
Modular Codebase for easy extension
Smart Timeout Management
Optimized Network Requests
Interactive CLI Flags for custom scanning
📁 Project Structure
SimpleFinder/
├── simplefinder.py              # PC main script
├── simplefinder-termux.py       # Termux optimized script
├── wordlists/                   # Default brute-force wordlists
├── results/                     # Auto-saved output files
├── requirements.txt             # Dependencies
└── README.md                    # Documentation
🚀 Getting Started
Prerequisites
Python 3.7+
pip package manager
Git (optional but recommended)
PC Installation
git clone https://github.com/Cyber-Specterz/SimpleFinder.git
cd SimpleFinder
pip install -r requirements.txt
python simplefinder.py instagram.com
Termux Installation
pkg update && pkg upgrade -y
pkg install python git -y
git clone https://github.com/Cyber-Specterz/SimpleFinder.git
cd SimpleFinder
python simplefinder-termux.py google.com
🎯 Usage Guide
Basic Command
python simplefinder.py [DOMAIN] [OPTIONS]
Examples
# Simple domain scan
python simplefinder.py instagram.com

# Scan with custom wordlist
python simplefinder.py google.com -w wordlists/custom.txt

# Verbose mode
python simplefinder.py facebook.com -v

# JSON output
python simplefinder.py test.com -o json
Performance Tuning
# High performance scan
python simplefinder.py target.com -t 100 --timeout 5

# Balanced scan
python simplefinder.py target.com -t 50 --timeout 10

# Mobile optimized (Termux)
python simplefinder-termux.py target.com -t 15 --timeout 15
Advanced Usage
# Batch scanning
for domain in $(cat domains.txt); do
    python simplefinder.py $domain -o json
done

# Piping into other tools
python simplefinder.py target.com | httpx -silent

# Copy results in Termux
cp results/*.txt ~/storage/shared/Download/
Command Options
Option	Short	Description	Default
--wordlist	-w	Custom wordlist file	Built-in
--threads	-t	Number of threads	50 (PC) / 15 (Termux)
--timeout	—	Timeout in seconds	10 (PC) / 15 (Termux)
--output	-o	Output format: txt, json	txt
--verbose	-v	Enable verbose output	False
--help	-h	Display help	—
📊 Output Examples
Console Output
══════════════════════════════════════════════════════════════════════════════

    ╔═══╗╔╗ ╔╗╔═══╗╔═══╗╔╗╔═══╗╔═══╗╔═══╗╔╗╔═══╗╔════╗
    ║╔══╝║║ ║║║╔══╝║╔══╝║║║╔══╝║╔══╝║╔══╝║║║╔══╝║╔╗╔╗║
    ║╚══╗║║ ║║║╚══╗║╚══╗║║║╚══╗║╚══╗║╚══╗║║║╚══╗╚╝║║╚╝
    ║╔══╝║║ ║║║╔══╝║╔══╝║║║╔══╝║╔══╝║╔══╝║║║╔══╝  ║║  
    ║╚══╗║╚═╝║║╚══╗║╚══╗║╚╝║╔══╝║╔══╝║╚══╗║╚╝║╔══╗ ║║  
    ╚═══╝╚═══╝╚═══╝╚═══╝╚══╝╚═══╝╚═══╝╚═══╝╚══╝╚═══╝ ╚╝  

══════════════════════════════════════════════════════════════════════════════

[*] Target Domain: instagram.com
[*] Threads: 50
[*] Timeout: 10s

[+] crt.sh: Found 24 subdomains
[+] Hackertarget: Found 18 subdomains
[+] Brute Force: Found 12 subdomains

[✓] SCAN COMPLETED
Total Subdomains Found: 42
Results saved in results/simplefinder_instagram_xxxxx.txt
⚙️ Performance Optimization
PC: 50–100 threads recommended
Termux: 10–15 threads for stability
Timeout: Increase to 15–20s on slow networks
Wordlists: Best performance with 100–200 entries
🤝 Contributing
Fork the repository
Create a feature branch
git checkout -b feature/your-feature
Commit your changes
git commit -m "Add new feature"
Push the branch
git push origin feature/your-feature
Open a Pull Request
Development Guidelines
Follow Python best practices
Write clean, modular code
Maintain output format consistency
Ensure compatibility with PC + Termux
📝 License
Copyright (c) 2024
Unauthorized copying, modification, or distribution is strictly prohibited.
Proprietary and confidential.
📞 Support
Email: support@cyber-specterz.com
GitHub Issues: https://github.com/Cyber-Specterz/SimpleFinder/issues
Built with ❤️ by Cyber-Specterz Team
