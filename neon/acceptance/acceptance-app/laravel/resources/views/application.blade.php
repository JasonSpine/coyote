<ul>
  @foreach($jobOfferTitles as $title)
    <li data-testid="jobOfferTitle">
      {{$title}}
    </li>
  @endforeach
</ul>
