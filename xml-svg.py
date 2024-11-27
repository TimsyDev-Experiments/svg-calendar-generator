import xml.etree.ElementTree as ET

# Create the root element
svg = ET.Element('svg', width='200', height='200', xmlns='http://www.w3.org/2000/svg')

# Create a rectangle element
rect = ET.SubElement(svg, 'rect', x='10', y='10', width='180', height='180', fill='lightblue')

# Create a text element
text = ET.SubElement(svg, 'text', x='50', y='100', font_size='30', fill='black')
text.text = 'Custom SVG'

# Convert the ElementTree to a string
svg_str = ET.tostring(svg, encoding='unicode')

# Save the SVG string to a file
with open('image.svg', 'w') as file:
    file.write(svg_str)