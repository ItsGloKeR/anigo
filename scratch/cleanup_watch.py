import os

file_path = "src/pages/Watch.jsx"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False

# We want to find the end of the new sidebar and the start of the old redundant code.
# The new sidebar ends with:
#             </div>
#           </aside>
#         </div>

found_aside_end = False
for i, line in enumerate(lines):
    if "          </aside>" in line and not found_aside_end and i < 700:
        found_aside_end = True
        new_lines.append(line)
        new_lines.append("        </div>\n") # Close the grid wrapper
        skip = True
        continue
    
    if skip:
        # We want to skip until "Premium Metadata" or the end of the old Episodes section (line 878 old)
        if "{/* Premium Metadata" in line or "{/* 7. Anime Details Section */}" in line:
            skip = False
        else:
            continue
            
    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
