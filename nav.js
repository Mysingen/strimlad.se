function get_location() {
    return location.pathname.split('#')[0]
}

function basename(path)
{
    var a = path.split('/');
    var b = a[a.length - 1];
    return decodeURIComponent(b);
}

function treename(path)
{
    var a = path.split('/');
    var b = a[a.length - 2];
    return decodeURIComponent(b);
}

function book_find_page_zero(book)
{
    for (var i = 0; i < book.pages.length; i++)
    {
        var a = basename(book.pages[i].path);
        if (a.startsWith('00.'))
            return book.pages[i];
    }
    return null;
}

function nav_find_book(nav_data, tree)
{
    var current = null;

    for (var i = 0; i < nav_data.length; i++)
    {
        var book = nav_data[i];
        if (decodeURIComponent(book.tree) == tree)
            return book;
        if (book.tree == '.')
            current = book; // catch-all
    }
    return current;
}

function same_book(book_1, book_2)
{
    if (book_1.tree == book_2.tree)
        return true;
    return false;
}

function same_page(page_path, location)
{
    var a = basename(page_path);
    var b = basename(location);
    
    if (a == b)
        return true;
    return false;
}

function get_path_prefix(book)
{
    if (book.tree == '.')
        return './';
    return '../';
}

function nav_main()
{
    this.draw = function(location)
    {
        var root = document.getElementById('nav');
        var tree = treename(location);
        var this_book = nav_find_book(nav_data, tree);
        
        for (var book of nav_data)
        {
            var page_zero = book_find_page_zero(book);
            var book_div = document.createElement('div');
            var a = document.createElement('a');

            a.setAttribute('class', 'nav_ref_book');
            a.innerHTML = book.title;
            book_div.appendChild(a);

            if (page_zero)
            {
                var path = book.tree + '/' + page_zero.path;;
                path = get_path_prefix(this_book) + path;
                a.setAttribute('href', path);
            }

            for (var page of book.pages)
            {
                var open = false;
                
                if (! same_book(this_book, book))
                    break;
                
                if (same_page(page.path, location))
                    open = true;
                
                for (var ref of page.refs)
                {
                    if (ref.tag != 'h1' && open == false)
                        continue;
                
                    var page_div = document.createElement('div');

                    var a = document.createElement('a');
                    if (ref.tag == 'h1')
                    {
                        if (open)
                            page_div.setAttribute(
                                'class', 'nref_' + ref.tag + ' ncur_page');
                        else
                            page_div.setAttribute('class', 'nref_' + ref.tag);
                        var path = book.tree + '/' + page.path;;
                        path = get_path_prefix(this_book) + path;
                        a.setAttribute('href', path);
                    }
                    else
                    {
                        var path = book.tree + '/' + page.path;;
                        path = get_path_prefix(this_book) + path;
                        a.setAttribute('href', path + '#' + ref.id);
                        page_div.setAttribute('class', 'nref_' + ref.tag);
                    }
                    a.innerHTML = ref.text;
                
                    page_div.appendChild(a);
                    book_div.appendChild(page_div);
                }
            }
            root.appendChild(book_div);
        }
    }
    
    this.draw(get_location());
}

window.addEventListener("load", nav_main);
