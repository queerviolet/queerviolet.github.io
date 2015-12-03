require 'open-uri'
require 'nokogiri'

url = ARGV[0]

while true
	puts '******************************************'
	puts "ashibrowse v.0.0000001 — Retrieving #{url}"
	body = open(url).read
	doc = Nokogiri::HTML(body)
	puts "Title: #{doc.title}"
	links = doc.search('a[href]')
	links.each_with_index do |a, i|
		puts "[#{i}] #{a.text} -- #{a.attr('href')}"
	end
	i = STDIN.gets.chomp.to_i
	relative_url = links[i].attr('href').to_s
	if not relative_url =~ /^http/
		url = "#{url}/#{relative_url}"
	else
		url = relative_url
	end
end